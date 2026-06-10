# 🎯 Computer Vision ROI (Region of Interest) Labeling Tool

[English Version](#english-version) | [Türkçe Sürüm](#türkçe-sürüm)

---

## Türkçe Sürüm

Bu proje, **Martur Fompak International** şirketinde staj dönemimde geliştirilmiş ve başarıyla **canlıya alınarak** aktif kullanıma sunulmuş web tabanlı bir **İlgi Alanı (ROI) Belirleme Aracıdır**. 

Küresel ölçekte **7 farklı ülkede bulunan 23 üretim tesisi ve 8.700'den fazla çalışanı** ile faaliyet gösteren Martur Fompak International bünyesindeki üretim hatlarında ve kalite kontrol süreçlerinde derin öğrenme (bilgisayarlı görü) modellerinin eğitilebilmesi için gerekli olan kritik koordinat verilerini üretir.

### 🚀 Canlı Önizleme
Geliştirilen aracı doğrudan tarayıcınızda test etmek için aşağıdaki bağlantıya tıklayabilirsiniz:
🔗 [Canlı Proje Linki](https://muhammetcancolak.github.io/ROI-Project-canl-ya-al-nan/)

### 💻 Projenin Amacı ve Çözdüğü Problem
Bilgisayarlı görü modellerini eğitirken, görüntü üzerindeki hatalı veya incelenmesi gereken bölgelerin (ROI) poligon olarak işaretlenmesi gerekir. Bu araç; üçüncü parti, karmaşık ve kurulum gerektiren yazılımlara ihtiyaç duymadan, tamamen tarayıcı üzerinden hızlı, ölçeklenebilir ve dinamik bir şekilde çokgen çizilmesini, etiketlenmesini ve bu verilerin modele doğrudan beslenebilecek standart bir JSON formatında dışarı aktarılmasını sağlar.

### 🛠️ Teknik Özellikler & Fonksiyonlar
* **Dinamik Poligon Çizimi:** Kullanıcı görsel üzerinde tıklayarak serbestçe çokgenler oluşturabilir, koordinatlar (`X, Y`) anlık olarak hesaplanır.
* **Responsive Çözünürlük Ölçeklendirme (Scaling):** Yüklenen görsellerin orijinal boyutları ile ekrandaki çizim alanı (container) arasındaki ölçek farkı matematiksel olarak oranlanır. Böylece büyük çözünürlüklü görsellerde bile tam doğru piksel koordinatları yakalanır.
* **Çoklu Tip ve ROI Yönetimi (Accordion UI):** Farklı nesne tipleri (`TypeId`) eklenebilir, her tip altında birden fazla ROI tanımlanabilir, düzenlenebilir veya silinebilir.
* **JSON Export:** Oluşturulan etiket verileri, `ClassId`, `PolyPointList` (Koordinat listesi) ve `Reverse` parametreleri ile hiyerarşik bir JSON dosyası olarak indirilir.

### 🚀 Kullanılan Teknolojiler
* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3 (Flexbox & Grid mimarisi)
* **Veri Yapısı:** Hiyerarşik JSON veri modellemesi

---

## English Version

This project is a web-based **Region of Interest (ROI) Labeling Tool** developed and successfully **deployed to production** during my internship at **Martur Fompak International**.

Operating on a global scale with **23 production facilities across 7 different countries and more than 8,700 employees**, Martur Fompak International utilizes this tool to generate critical coordinate data required for training deep learning (computer vision) models within its production lines and quality control processes.

### 🚀 Live Preview
You can test the tool directly in your browser via the following link:
🔗 [Live Project Link](https://muhammetcancolak.github.io/ROI-Project-canl-ya-al-nan/)

### 💻 Purpose & Problem Solved
When training computer vision models, specific regions or material defects on an image (ROI) must be labeled as polygons. This tool allows users to draw and label dynamic polygons entirely via the browser without requiring any complex, third-party software installations. It exports the labeled data into a standardized hierarchical JSON format ready to be fed into deep learning models.

### 🛠️ Key Features & Technical Depth
* **Dynamic Polygon Drawing:** Users can click on the image to seamlessly create custom polygons; pixel coordinates (`X, Y`) are calculated instantaneously.
* **Responsive Resolution Scaling:** The scale difference between the original image resolution and the screen display container is mathematically calculated and proportioned. This ensures precise pixel coordinates even on high-resolution images.
* **Multi-Type & ROI Management (Accordion UI):** Supports adding distinct object categories (`TypeId`) and managing multiple ROIs under each category with add, edit, and delete functionalities.
* **JSON Export:** Labeled data is exported as a structured JSON file containing `ClassId`, `PolyPointList` (Coordinate sequence), and `Reverse` flags.

### 🚀 Technologies Used
* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3 (Flexbox & Grid Layouts)
* **Data Structure:** Hierarchical JSON Data Modeling