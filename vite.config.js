import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import * as XLSX from 'xlsx'

import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

const excelCache = new Map();

function excelExportPlugin() {
  return {
    name: 'excel-export-server',
    configureServer(server) {
      // 1. Prepare and Save Excel directly to disk
      server.middlewares.use('/api/prepare-excel', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { rows = [], openNow = false } = JSON.parse(body || '{}');
              const wb = XLSX.utils.book_new();
              const ws = XLSX.utils.aoa_to_sheet(rows);
              ws['!cols'] = [
                { wch: 6 },
                { wch: 20 },
                { wch: 38 },
                { wch: 45 },
                { wch: 18 },
                { wch: 14 },
                { wch: 26 },
                { wch: 20 },
                { wch: 20 },
                { wch: 15 },
                { wch: 26 }
              ];
              XLSX.utils.book_append_sheet(wb, ws, 'Control Operativo 2026');

              const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
              const dateStr = new Date().toISOString().split('T')[0];
              const filename = `Matriz_Control_Operativo_Bosques_Robledal_${dateStr}.xlsx`;

              // Save directly to D:\Downloads if exists, otherwise to user profile
              const downloadDirs = ['D:\\Downloads', path.join(process.env.USERPROFILE || '', 'Downloads'), process.cwd()];
              let savedPath = '';

              for (const dir of downloadDirs) {
                if (fs.existsSync(dir)) {
                  try {
                    const targetPath = path.join(dir, filename);
                    fs.writeFileSync(targetPath, buf);
                    savedPath = targetPath;
                    break;
                  } catch (e) {
                    console.error('Failed to write to dir:', dir, e.message);
                  }
                }
              }

              // Also save a permanent copy in the workspace
              try {
                fs.writeFileSync(path.join(process.cwd(), filename), buf);
              } catch (_) {}

              // If openNow is requested or if user wants to open directly in Excel
              if (openNow && savedPath) {
                exec(`start "" "${savedPath}"`, (err) => {
                  if (err) console.error('Failed to open Excel:', err);
                });
              }

              const fileId = 'excel_' + Date.now();
              excelCache.set(fileId, buf);
              setTimeout(() => excelCache.delete(fileId), 180000);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                success: true, 
                fileId, 
                filename, 
                savedPath, 
                downloadUrl: `/api/download-excel?fileId=${fileId}` 
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });

      // 2. Open file in Excel directly via Windows shell
      server.middlewares.use('/api/open-excel', (req, res) => {
        const fullUrl = new URL(req.url, 'http://localhost:5173');
        const filePath = fullUrl.searchParams.get('path');
        const targetPath = filePath && fs.existsSync(filePath) 
          ? filePath 
          : path.join('D:\\Downloads', `Matriz_Control_Operativo_Bosques_Robledal_${new Date().toISOString().split('T')[0]}.xlsx`);

        if (fs.existsSync(targetPath)) {
          exec(`start "" "${targetPath}"`, (err) => {
            if (err) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: err.message }));
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, opened: targetPath }));
          });
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'File not found on disk' }));
        }
      });

      // 3. Open folder in Windows File Explorer
      server.middlewares.use('/api/open-folder', (req, res) => {
        const targetDir = fs.existsSync('D:\\Downloads') ? 'D:\\Downloads' : process.cwd();
        exec(`explorer.exe "${targetDir}"`, (err) => {
          if (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message }));
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, folder: targetDir }));
        });
      });

      // 4. Direct GET Download
      server.middlewares.use('/api/download-excel', (req, res) => {
        const fullUrl = new URL(req.url, 'http://localhost:5173');
        const fileId = fullUrl.searchParams.get('fileId');
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `Matriz_Control_Operativo_Bosques_Robledal_${dateStr}.xlsx`;

        const buf = fileId ? excelCache.get(fileId) : null;
        if (!buf) {
          res.statusCode = 404;
          return res.end('Archivo no encontrado. Vuelve a hacer clic en Descargar Excel.');
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buf.length);
        res.end(buf);
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    excelExportPlugin()
  ],
})

