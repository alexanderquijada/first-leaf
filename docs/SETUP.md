# Setup (one time)

This gets your Mac ready and puts First Leaf on GitHub. You run **one script**. It never asks you to make a decision, it's safe to run again (it skips anything already done), and every step ends with ✓ (done) or ✗ (what went wrong and how to fix it).

## 1. Run the script

1. Download `setup.sh` from the planning chat. It lands in your **Downloads** folder.
2. Open **Terminal** (press ⌘ Space, type *Terminal*, press Return).
3. Paste this and press Return:

   ```bash
   bash ~/Downloads/setup.sh
   ```

4. If macOS asks whether Terminal may access a folder, click **Allow**. If it asks for your Mac password (only when installing Homebrew), type it and press Return. Nothing shows while you type; that's normal.

It takes 1–5 minutes, depending on what's already installed.

## 2. What the script does

| Step | What it does | If it's already done |
|---|---|---|
| Homebrew | Installs the Mac package manager | Skips |
| Node | Installs Node 22 or newer (runs the project and its checks) | Skips if you have 20+ |
| Git | Checks it works; if not, opens Apple's installer | Skips |
| GitHub CLI | Installs `gh` | Skips |
| Claude Code | Installs the `claude` command (the VS Code extension is separate) | Skips |
| GitHub login | Confirms `gh` is logged in and lets git use that login | ✗ with the fix if you're logged out |
| Git name/email | Sets them from your GitHub account if they're blank | Skips if set |
| Pelipper Post | Finds your last project so Claude Code can read it (read-only) | Reports where it is, or that it wasn't found |
| Project folder | Creates `~/Projects/first-leaf` and writes every project file | Never overwrites a file that already exists |
| Checks | Runs the data validator (42 rules), its self-test (65 broken cases) and the folder-boundary self-test | Runs again |
| First commit | Creates the git history with one `[shared]` commit | Skips if there's already history |
| GitHub repo | Creates the **public** repo `first-leaf` and pushes | Skips; pushes if you're ahead |

## 3. Two browser steps (about 2 minutes)

**A. Import the repo into Vercel** (use the **same Vercel account as Pelipper Post**)
1. Go to <https://vercel.com/new> and make sure the account/team at the top is the one Pelipper Post uses.
2. Find **first-leaf** in the list and click **Import**.
3. Leave every setting as it is. `vercel.json` already sets the framework (Vite), the build command and the output folder. Click **Deploy**.
4. Wait for the confetti. A simple "First Leaf… being built" page is correct for now.

**B. Check Claude Code's account**
1. In VS Code, open the folder: **File → Open Folder… → Projects → first-leaf**.
2. Open Claude Code and type `/status`. Check that it shows the account you want billed. If not, type `/login` and switch.

Then paste the **Phase 0** prompt from the planning chat into Claude Code.

## 4. If you see a ✗

| Message | What to do |
|---|---|
| ✗ Homebrew install failed | Run the script again. If it fails twice, copy the red text into the planning chat. |
| ✗ Git isn't set up yet | A window called "Install Command Line Developer Tools" opened. Click **Install**, wait for it to finish, then run the script again. |
| ✗ GitHub CLI isn't logged in | Run `gh auth login`, choose **GitHub.com → HTTPS → Login with a web browser**, then run the script again. |
| ✗ Data checks failed | Something in the files is off. Copy the output into the planning chat; don't edit anything. |
| ✗ Couldn't push to GitHub | A repo called `first-leaf` may already exist with different history. Copy the output into the planning chat. |

## 5. Safe to re-run

Run it again any time: after an error, on a new Mac, or to check your setup. It skips what's done and never overwrites project files you or Claude Code have changed.
