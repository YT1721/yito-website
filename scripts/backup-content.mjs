import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.join(root, "backups", `yito-${stamp}`);

await mkdir(backupDir, { recursive: true });
await cp(path.join(root, "content"), path.join(backupDir, "content"), {
  recursive: true
});

await cp(path.join(root, "public", "uploads"), path.join(backupDir, "uploads"), {
  recursive: true,
  force: true
}).catch(() => undefined);

await writeFile(
  path.join(backupDir, "README.txt"),
  [
    "YITO website content backup",
    `Created at: ${new Date().toISOString()}`,
    "",
    "Restore content:",
    "cp -r backups/<backup-name>/content ./content",
    "",
    "Restore uploads:",
    "cp -r backups/<backup-name>/uploads ./public/uploads"
  ].join("\n")
);

console.log(`Backup created: ${backupDir}`);
