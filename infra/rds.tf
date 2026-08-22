# RDSは最低2つのAZにまたがるサブネットグループが必要(単一AZ運用でも要件は変わらない)
resource "aws_db_subnet_group" "this" {
  name       = "taskboard-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "taskboard-db-subnet-group"
  }
}

# RDS用セキュリティグループ: 送信元はEC2のセキュリティグループのみ。
# CIDR(IPアドレス範囲)によるルールは一切設定しないため、自分のPCも含めEC2以外からは到達できない。
resource "aws_security_group" "rds" {
  name        = "taskboard-rds-sg"
  description = "Allow PostgreSQL access from the EC2 instance only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "PostgreSQL from EC2 only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "taskboard-rds-sg"
  }
}

resource "random_password" "db" {
  length  = 20
  special = false
}

resource "aws_db_instance" "this" {
  identifier     = "taskboard-db"
  engine         = "postgres"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp2"

  db_name  = "taskboard"
  username = "taskboard"
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false

  skip_final_snapshot = true

  tags = {
    Name = "taskboard-db"
  }
}

output "rds_endpoint" {
  value = aws_db_instance.this.endpoint
}

output "rds_password" {
  value     = random_password.db.result
  sensitive = true
}
