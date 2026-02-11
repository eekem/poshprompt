export interface FingerprintData {
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
  screen?: string;
  timezone?: string;
  language?: string;
}

export function collectFingerprint(): FingerprintData {
  const userAgent = navigator.userAgent;
  
  // Basic device detection
  const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop';
  
  // Basic browser detection
  let browser = 'unknown';
  if (userAgent.includes('Chrome')) browser = 'chrome';
  else if (userAgent.includes('Firefox')) browser = 'firefox';
  else if (userAgent.includes('Safari')) browser = 'safari';
  else if (userAgent.includes('Edge')) browser = 'edge';
  
  // Basic OS detection
  let os = 'unknown';
  if (userAgent.includes('Windows')) os = 'windows';
  else if (userAgent.includes('Mac')) os = 'macos';
  else if (userAgent.includes('Linux')) os = 'linux';
  else if (userAgent.includes('Android')) os = 'android';
  else if (userAgent.includes('iOS')) os = 'ios';
  
  return {
    userAgent,
    device,
    browser,
    os,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
}

export async function getFingerprintHash(): Promise<string> {
  const fingerprintData = collectFingerprint();
  
  // Add some canvas fingerprinting for better uniqueness
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Fingerprint text', 2, 2);
    const canvasFingerprint = canvas.toDataURL();
    
    // Combine all data
    const fingerprintString = JSON.stringify({
      ...fingerprintData,
      canvas: canvasFingerprint.slice(0, 100), // Take first 100 chars
    });
    
    // Create hash
    const msgBuffer = new TextEncoder().encode(fingerprintString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }
  
  // Fallback if canvas is not available
  const fingerprintString = JSON.stringify(fingerprintData);
  const msgBuffer = new TextEncoder().encode(fingerprintString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
