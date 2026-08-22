# 自分の現在のグローバルIPを取得し、セキュリティグループの送信元を自分だけに絞り込む
data "http" "myip" {
  url = "https://checkip.amazonaws.com"
}

locals {
  my_ip_cidr = "${trimspace(data.http.myip.response_body)}/32"
}

# デフォルトVPC・デフォルトサブネットをそのまま使う(新規VPCは作らない)
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# 最新のAmazon Linux 2023 AMIをSSMパラメータ経由で取得(ハードコードしない)
data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

# SSH接続用のキーペアをTerraformで新規生成する
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "this" {
  key_name   = "taskboard-ec2-key"
  public_key = tls_private_key.ssh.public_key_openssh
}

resource "local_file" "ssh_private_key" {
  content         = tls_private_key.ssh.private_key_pem
  filename        = "${path.module}/taskboard-ec2-key.pem"
  file_permission = "0600"
}

resource "aws_security_group" "ec2" {
  name        = "taskboard-ec2-sg"
  description = "Allow SSH/backend/frontend access from my IP only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [local.my_ip_cidr]
  }

  ingress {
    description = "Backend API"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [local.my_ip_cidr]
  }

  ingress {
    description = "Frontend"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [local.my_ip_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "taskboard-ec2-sg"
  }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ssm_parameter.al2023_ami.value
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.this.key_name
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.ec2.id]

  user_data = <<-EOF
    #!/bin/bash
    dnf install -y java-21-amazon-corretto docker
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ec2-user
  EOF

  tags = {
    Name = "taskboard-app"
  }
}

output "instance_public_ip" {
  value = aws_instance.app.public_ip
}

output "ssh_command" {
  value = "ssh -i ${local_file.ssh_private_key.filename} ec2-user@${aws_instance.app.public_ip}"
}
