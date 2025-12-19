const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Image URLs extracted from network requests
const imageUrls = [
  // Logo
  'https://static.wixstatic.com/media/327124_2944f1a4ef824c33a5d3a9c7c9ab852b~mv2.png/v1/crop/x_87,y_280,w_1112,h_355/fill/w_306,h_97,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/327124_2944f1a4ef824c33a5d3a9c7c9ab852b~mv2.png',
  
  // Hero image
  'https://static.wixstatic.com/media/327124_c67e523bdb98478ca86c528e32058a96~mv2.jpg/v1/fill/w_634,h_634,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Asian%20IT%20female%20engineer%20in%20data%20centers.jpg',
  
  // Service images
  'https://static.wixstatic.com/media/327124_b5d70508325a442c82dccf072c51b6da~mv2.jpg/v1/fill/w_214,h_288,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Asian%20engineer%20performing%20replacement%20of%20parts%20in%20a%20data%20center.jpg',
  'https://static.wixstatic.com/media/327124_f0124517ac7f40c89e749703f71cff4a~mv2.jpg/v1/fill/w_214,h_286,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/asian%20logistic%20lady%20in%20a%20warehouse%20packing.jpg',
  'https://static.wixstatic.com/media/327124_9b5947d2a3e74deca61fb36bd7688212~mv2.png/v1/fill/w_214,h_286,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Felmale%20Engineer.png',
  
  // Why RTA image
  'https://static.wixstatic.com/media/327124_fd0ea3f4d10d4317bf8c30de31505ee2~mv2.jpg/v1/fill/w_584,h_410,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/why%20RTA_edited.jpg',
  
  // ACA Logo
  'https://static.wixstatic.com/media/327124_f5f578950dfd45de85d2ccf59e057814~mv2.png/v1/fill/w_483,h_93,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ACA%20Logo_edited.png',
  
  // Brand logos
  'https://static.wixstatic.com/media/327124_170c8dfffcb0438f9d6c3d2bcc80698a~mv2.png/v1/fill/w_258,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dell%20EMC_edited_edited_edited.png',
  'https://static.wixstatic.com/media/327124_d3530c9a561c41d28dd8a98ba74ad576~mv2.png/v1/fill/w_154,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IBM_edited.png',
  'https://static.wixstatic.com/media/327124_d77b1685c5884e038c2ce574a1a6a2ff~mv2.png/v1/fill/w_130,h_126,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HPE_edited.png',
  'https://static.wixstatic.com/media/327124_14ce9412b4e94e8c858cfbfbb9286975~mv2.png/v1/fill/w_183,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Sun%20Oracle_edited.png',
  'https://static.wixstatic.com/media/327124_dfb1a78b010a42a8bc4430f533e76efe~mv2.png/v1/fill/w_143,h_184,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/NetApp_edited.png',
  'https://static.wixstatic.com/media/327124_a3d966fdeac1462b8daf6931e298f78e~mv2.png/v1/fill/w_130,h_132,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Huawei_edited.png',
  'https://static.wixstatic.com/media/327124_c408e3237abe4f958a2f3ca6cb32211e~mv2.png/v1/fill/w_195,h_105,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Cisco_edited.png',
  'https://static.wixstatic.com/media/327124_0938f60f635c48849cb3740c5b0ea914~mv2.png/v1/fill/w_207,h_105,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Fujitsu_edited.png',
];

// Mapping of URLs to local filenames
const imageMapping = {
  '327124_2944f1a4ef824c33a5d3a9c7c9ab852b~mv2.png': 'logo.png',
  '327124_c67e523bdb98478ca86c528e32058a96~mv2.jpg': 'hero-engineer.jpg',
  '327124_b5d70508325a442c82dccf072c51b6da~mv2.jpg': 'maintenance.jpg',
  '327124_f0124517ac7f40c89e749703f71cff4a~mv2.jpg': 'logistics.jpg',
  '327124_9b5947d2a3e74deca61fb36bd7688212~mv2.png': 'engineer.jpg',
  '327124_fd0ea3f4d10d4317bf8c30de31505ee2~mv2.jpg': 'why-rta.jpg',
  '327124_f5f578950dfd45de85d2ccf59e057814~mv2.png': 'aca-logo.png',
  '327124_170c8dfffcb0438f9d6c3d2bcc80698a~mv2.png': 'dell-emc.png',
  '327124_d3530c9a561c41d28dd8a98ba74ad576~mv2.png': 'ibm.png',
  '327124_d77b1685c5884e038c2ce574a1a6a2ff~mv2.png': 'hpe.png',
  '327124_14ce9412b4e94e8c858cfbfbb9286975~mv2.png': 'sun-oracle.png',
  '327124_dfb1a78b010a42a8bc4430f533e76efe~mv2.png': 'netapp.png',
  '327124_a3d966fdeac1462b8daf6931e298f78e~mv2.png': 'huawei.png',
  '327124_c408e3237abe4f958a2f3ca6cb32211e~mv2.png': 'cisco.png',
  '327124_0938f60f635c48849cb3740c5b0ea914~mv2.png': 'fujitsu.png',
};

const outputDir = path.join(__dirname, '../public/assets/original');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    // Use the full URL with query parameters
    const filepath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filepath);
    
    console.log(`Downloading ${filename}...`);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.rtaservices.net/',
      },
    };
    
    client.get(options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        return downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded ${filename}`);
        resolve(filepath);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

async function downloadAll() {
  const manifest = [];
  
  for (const url of imageUrls) {
    // Extract base filename from URL
    const urlParts = url.split('/');
    const baseFilename = urlParts[urlParts.length - 1].split('?')[0];
    
    // Get mapped filename or use base
    let filename = imageMapping[baseFilename] || baseFilename;
    
    // Ensure proper extension
    if (!filename.match(/\.(png|jpg|jpeg|svg|webp)$/i)) {
      if (url.includes('.png')) filename += '.png';
      else if (url.includes('.jpg') || url.includes('.jpeg')) filename += '.jpg';
    }
    
    try {
      // Try to get original image without transformations
      const originalUrl = url.split('?')[0].replace(/\/v1\/[^/]+/, '');
      await downloadImage(originalUrl, filename);
      
      manifest.push({
        original_url: url,
        local_path: `assets/original/${filename}`,
        used_in_component: getComponentForImage(filename),
      });
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error.message);
    }
  }
  
  // Write manifest
  fs.writeFileSync(
    path.join(__dirname, '../asset-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`\n✓ Downloaded ${manifest.length} images`);
  console.log(`✓ Manifest saved to asset-manifest.json`);
}

function getComponentForImage(filename) {
  if (filename.includes('logo')) return 'Navbar';
  if (filename.includes('hero')) return 'Hero';
  if (filename.includes('maintenance')) return 'Services';
  if (filename.includes('logistics')) return 'Services';
  if (filename.includes('engineer') && !filename.includes('hero')) return 'Services';
  if (filename.includes('why-rta')) return 'WhyChooseUs';
  if (filename.includes('aca')) return 'PartnerSection';
  if (filename.match(/(dell|ibm|hpe|oracle|netapp|huawei|cisco|fujitsu)/i)) return 'BrandLogos';
  return 'Unknown';
}

downloadAll().catch(console.error);

