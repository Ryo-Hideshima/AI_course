---
name: server-startup
description: Start this project's backend (Spring Boot, default port 8080) and frontend (Vite, default port 5173) dev servers for manual verification. Use this whenever the user asks to start/run/launch the app, boot the servers, or check that a change actually works end to end in the browser. Always start on the project's default ports — if a default port is already in use, free that port and restart on it rather than letting the server fall back to an alternate port.
---

# Server Startup

This project (AI_course task board) always runs its dev servers on fixed default ports:

- Backend (Spring Boot, via `backend/gradlew`): **8080**
- Frontend (Vite, via `frontend`): **5173**

Other tools and browser bookmarks, `.env` values, and prior verification steps all assume these exact ports. A server that silently starts on a different port (e.g. Vite's automatic `5174` fallback when `5173` is busy) breaks that assumption and makes "it works" checks misleading. Because of that, this skill's core rule is:

**Never let a server fall back to a non-default port. If the default port is occupied, free it first, then start on the default port.**

## Steps

1. **Check whether the default ports are already in use** before starting anything:
   ```bash
   lsof -ti:8080
   lsof -ti:5173
   ```
   Empty output means the port is free.

2. **If a port is occupied, free it** rather than starting the new server elsewhere:
   ```bash
   lsof -ti:8080 | xargs kill
   # if the process is still listening after a couple seconds:
   lsof -ti:8080 | xargs kill -9
   ```
   Do the same for 5173 if needed. Confirm the port is free (`lsof -ti:<port>` returns nothing) before moving on.

3. **Start PostgreSQL** (backend depends on it):
   ```bash
   docker compose up -d
   ```
   Wait for readiness: `docker compose exec -T postgres pg_isready -U taskboard`.

4. **Start the backend** on 8080, in the background, logging to a file so you can poll it:
   ```bash
   cd backend && export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH" && ./gradlew bootRun > /tmp/bootrun.log 2>&1 &
   ```
   Poll `curl -sf http://localhost:8080/actuator/health` until it returns `"status":"UP"`. If it never comes up, check `/tmp/bootrun.log` — don't assume a port conflict caused it without checking, since Spring Boot fails outright (it doesn't auto-switch ports) when 8080 is taken.

5. **Start the frontend** on 5173:
   ```bash
   cd frontend && npm run dev > /tmp/vite.log 2>&1 &
   ```
   Read `/tmp/vite.log` and confirm it says `Local:   http://localhost:5173/`. If Vite logs that it's "trying another one" because 5173 is in use, stop it, free port 5173 (step 2), and restart it — do not proceed with the alternate port it picked.

6. **Verify** with `curl` against the confirmed ports (e.g. `curl http://localhost:8080/api/tasks`), and open the frontend in the browser (`open http://localhost:5173`) for visual confirmation when relevant.

7. **When done**, stop what you started: kill the backend/frontend processes (`pkill -f TaskboardApplication`, kill the Vite process), and stop PostgreSQL with `docker compose down` if it doesn't need to stay up for further work.
