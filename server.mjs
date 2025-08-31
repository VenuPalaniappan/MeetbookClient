import express from "express";
import path from "path";
import helmet from "helmet";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.disable("x-powered-by");

const SELF = "'self'";


const IMG_HOSTS = ["https://images.pexels.com"];
const API_HOSTS = [SELF, "http://localhost:8800"]; 

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      // Core fallback and hardening
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],

      // Scripts / Styles
      scriptSrc: ["'self'"],                  // no 'unsafe-inline' / 'unsafe-eval'
      scriptSrcElem: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
      styleSrcAttr: ["'none'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],

      // Images / Media
      imgSrc: ["'self'", "data:", "blob:", "https://images.pexels.com"],
      mediaSrc: ["'self'"],

      // Network / APIs
      connectSrc: ["'self'", "http://localhost:8800"],

      // Frames / Workers / Manifests / Prefetch
      frameAncestors: ["'self'"],             // anti-clickjacking (who may embed you)
      frameSrc: ["'self'"],                   // if you embed iframes (not ancestors)
      childSrc: ["'self'"],                   // legacy for workers/frames (ZAP likes it)
      workerSrc: ["'self'", "blob:"],         // service/web workers
      manifestSrc: ["'self'"],
      

      // Forms
      formAction: ["'self'"],

      // Only enable this when your site is fully HTTPS end-to-end
      // upgradeInsecureRequests: [],
    }
  })
);


app.use(helmet.frameguard({ action: "deny" })); 
app.use(helmet.noSniff());                      



app.use(express.static(path.join(__dirname, "dist")));
app.use((req, res, next) => {
  if (req.method !== "GET") return next();           
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Prod-like server running: http://localhost:${PORT}`);
});
