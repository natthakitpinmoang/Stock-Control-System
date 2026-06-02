// เปลี่ยนเลขเวอร์ชันตรงนี้ทุกครั้งที่มีการอัปเดตไฟล์ index.html (เช่น v2, v3, v4)
const CACHE_NAME = "inventory-system-v2";

self.addEventListener("install", e => {
  self.skipWaiting(); // บังคับให้ Service Worker ตัวใหม่ทำงานทันทีไม่ต้องรอ
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json"
      ]);
    })
  );
});

self.addEventListener("activate", e => {
  // ลบ Cache เวอร์ชันเก่าทิ้ง เพื่อไม่ให้เครื่องจำไฟล์เก่า
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    // กลยุทธ์ Network-First: ดึงไฟล์ใหม่จากเน็ตก่อน ถ้าเน็ตหลุด/ไม่มีเน็ต ค่อยเอาจาก Cache
    fetch(e.request).catch(() => caches.match(e.request))
  );
});