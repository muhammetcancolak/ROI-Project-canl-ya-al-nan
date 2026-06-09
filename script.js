document.addEventListener("DOMContentLoaded", function () {
    // **DOM Elemanları**
    const uploadButton = document.getElementById("uploadButton");
    const uploadedImage = document.getElementById("uploadedImage");
    const pointsContainer = document.getElementById("pointsContainer");
    const confirmROIButton = document.getElementById("confirmROI");
    const classIdInput = document.getElementById("classIdInput");
    const reverseCheckbox = document.getElementById("reverseCheckbox");
    const addNewTypeButton = document.getElementById("addNewType");
    const downloadJsonButton = document.getElementById("downloadJson");

    // **Değişkenler**
    let points = [];
    let typeCounter = 0;
    let storedData = [{ TypeId: typeCounter, Regions: [] }];
    let imageOffsetX = 0, imageOffsetY = 0;
    let imageScaleX = 1, imageScaleY = 1;

    // **Resim Yükleme Olayı**
    uploadButton.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.addEventListener("change", () => {
            if (input.files.length > 0) {
                displayImage(input.files[0]);
            }
        });
    });

    // **Resmi Konumlandırma**
    function displayImage(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const image = new Image();
            image.onload = function () {
                const containerWidth = pointsContainer.clientWidth;
                const containerHeight = pointsContainer.clientHeight;
                const aspectRatio = image.naturalWidth / image.naturalHeight;

                let drawWidth = containerWidth;
                let drawHeight = containerWidth / aspectRatio;

                if (drawHeight > containerHeight) {
                    drawHeight = containerHeight;
                    drawWidth = drawHeight * aspectRatio;
                }

                imageOffsetX = (containerWidth - drawWidth) / 2;
                imageOffsetY = (containerHeight - drawHeight) / 2;
                imageScaleX = drawWidth / image.naturalWidth;
                imageScaleY = drawHeight / image.naturalHeight;

                uploadedImage.src = event.target.result;
                uploadedImage.style.display = "block";
                uploadedImage.style.position = "absolute";
                uploadedImage.style.width = `${drawWidth}px`;
                uploadedImage.style.height = `${drawHeight}px`;
                uploadedImage.style.left = `${imageOffsetX}px`;
                uploadedImage.style.top = `${imageOffsetY}px`;
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function addPoint(x, y) {
        const point = document.createElement("div");
        point.classList.add("point");

        point.style.left = `${x * imageScaleX + imageOffsetX}px`;
        point.style.top = `${y * imageScaleY + imageOffsetY}px`;

        pointsContainer.appendChild(point);
        points.push({ x: Math.round(x), y: Math.round(y) });

        if (points.length > 1) {
            drawLine(points[points.length - 2], points[points.length - 1]);
        }
    }

    // **Tıklanan Noktaları Ekleme**
    uploadedImage.addEventListener("click", function (event) {
        if (!uploadedImage.src) return;

        const rect = uploadedImage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / imageScaleX;
        const y = (event.clientY - rect.top) / imageScaleY;

        addPoint(x, y);
    });

    // **ROI Onaylama**
    confirmROIButton.addEventListener("click", function () {
        if (points.length < 3) {
            alert("ROI oluşturmak için en az 3 nokta eklemelisiniz!");
            return;
        }

        drawLine(points[points.length - 1], points[0]);

        const reverseValue = validateReverseSelection();
        if (reverseValue === null) return;

        const classIdValues = classIdInput.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));

        if (classIdValues.length === 0) {
            alert("Lütfen geçerli bir ClassId girin!");
            return;
        }

        const newROI = {
            ClassId: classIdValues,
            PolyPointList: points.map(p => ({ X: Math.round(p.x), Y: Math.round(p.y) })),
            Reverse: reverseValue
        };

        let currentType = storedData.find(t => t.TypeId === typeCounter);
        if (!currentType) {
            currentType = { TypeId: typeCounter, Regions: [] };
            storedData.push(currentType);
        }

        currentType.Regions.push(newROI);

        let roiIndex = storedData.find(t => t.TypeId === typeCounter).Regions.length - 1;
        updateROIInfo(newROI, typeCounter, roiIndex);

        points = [];
        classIdInput.value = "";
        reverseCheckbox.checked = false;

    });

    addNewTypeButton.addEventListener("click", function () {
        typeCounter++;
        storedData.push({ TypeId: typeCounter, Regions: [] });
        pointsContainer.innerHTML = "";

    });

    function validateReverseSelection() {
        return reverseCheckbox.checked;
    }

    // **Çizgileri Çizme**
    function drawLine(point1, point2) {
        const line = document.createElement("div");
        line.classList.add("line");

        const length = Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
        const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI);

        line.style.width = `${length * imageScaleX}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.left = `${point1.x * imageScaleX + imageOffsetX}px`;
        line.style.top = `${point1.y * imageScaleY + imageOffsetY}px`;

        pointsContainer.appendChild(line);
    }

    // **JSON Olarak İndirme**
    downloadJsonButton.addEventListener("click", function () {
        const blob = new Blob([JSON.stringify(storedData, null, 4)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "roi_data.json";
        a.click();
    });


    function showROIPolygonsForType(typeId) {
        pointsContainer.innerHTML = "";

        const typeData = storedData.find(t => t.TypeId === typeId);
        if (!typeData) return;

        typeData.Regions.forEach(region => {
            const polyPoints = region.PolyPointList;
            for (let i = 0; i < polyPoints.length; i++) {
                const point = polyPoints[i];

                const pointEl = document.createElement("div");
                pointEl.classList.add("point");
                pointEl.style.left = `${point.X * imageScaleX + imageOffsetX}px`;
                pointEl.style.top = `${point.Y * imageScaleY + imageOffsetY}px`;
                pointsContainer.appendChild(pointEl);

                const nextPoint = polyPoints[(i + 1) % polyPoints.length];
                drawLine({ x: point.X, y: point.Y }, { x: nextPoint.X, y: nextPoint.Y });
            }
        });
    }

    function updateROIInfo(roi, typeId, roiIndex) {
        const rightPanel = document.querySelector(".right-panel");
        let typeContainer = rightPanel.querySelector(`#type-${typeId}`);
        if (!typeContainer) {
            typeContainer = document.createElement("div");
            typeContainer.id = `type-${typeId}`;
            typeContainer.classList.add("type-container");

            // Accordion header: type başlığı
            const header = document.createElement("div");
            header.classList.add("accordion-header");
            header.textContent = `Type ${typeId}`;
            header.addEventListener("click", function () {
                const content = typeContainer.querySelector(".accordion-content");
                if (content.style.display === "none") {
                    content.style.display = "block";
                    // Seçilen tipe ait çokgenleri sol panelde çiz
                    showROIPolygonsForType(typeId);
                } else {
                    content.style.display = "none";
                    // Kapatıldığında çizimleri temizle
                    pointsContainer.innerHTML = "";
                }
            });

            // Accordion content: ROI bilgilerini içerecek alan
            const content = document.createElement("div");
            content.classList.add("accordion-content");
            content.style.display = "none"; // Varsayılan kapalı

            typeContainer.appendChild(header);
            typeContainer.appendChild(content);
            rightPanel.appendChild(typeContainer);
        }

        // Accordion content alanını seçiyoruz
        const content = typeContainer.querySelector(".accordion-content");

        // Yeni ROI bilgilerini içeren infoBox'u oluşturuyoruz
        const infoBox = document.createElement("div");
        infoBox.classList.add("info-box");

        infoBox.innerHTML = `
        <div class="info-item">
            <strong>ClassId:</strong> 
            <input type="text" class="classIdInput" value="${roi.ClassId.join(", ")}" disabled>
        </div>
        <div class="info-item">
            <strong>Reverse:</strong> 
            <input type="checkbox" class="reverseCheckbox" ${roi.Reverse ? "checked" : ""} disabled>
        </div>
        <div class="info-item">
            <strong>Koordinatlar:</strong>
            <div class="coordinates-list">
                ${roi.PolyPointList.map(p => `<div>X: ${p.X}, Y: ${p.Y}</div>`).join(" ")}
            </div>
        </div>
        <button class="editButton">Düzenle</button>
        <button class="saveButton" disabled>Kaydet</button>
        <button class="deleteButton">Sil</button>
    `;

        content.appendChild(infoBox);

        // InfoBox içindeki elemanların seçimi ve olayları
        const classIdInput = infoBox.querySelector(".classIdInput");
        const reverseCheckbox = infoBox.querySelector(".reverseCheckbox");
        const editButton = infoBox.querySelector(".editButton");
        const saveButton = infoBox.querySelector(".saveButton");
        const deleteButton = infoBox.querySelector(".deleteButton");

        // Düzenle butonu: inputları aktif hale getirir
        editButton.addEventListener("click", function () {
            classIdInput.disabled = false;
            reverseCheckbox.disabled = false;
            saveButton.disabled = false;
        });

        // Kaydet butonu: değişiklikleri JSON verisine yansıtır
        saveButton.addEventListener("click", function () {
            const newClassIdValues = classIdInput.value.split(',')
                .map(v => parseInt(v.trim()))
                .filter(v => !isNaN(v));
            const newReverseValue = reverseCheckbox.checked;

            if (newClassIdValues.length === 0) {
                alert("Geçerli bir ClassId girin!");
                return;
            }

            storedData.forEach(type => {
                if (type.TypeId === typeId) {
                    type.Regions[roiIndex].ClassId = newClassIdValues;
                    type.Regions[roiIndex].Reverse = newReverseValue;
                }
            });

            classIdInput.disabled = true;
            reverseCheckbox.disabled = true;
            saveButton.disabled = true;

            alert("Değişiklikler kaydedildi!");
        });

        // Silme butonu: ROI bilgisini siler
        deleteButton.addEventListener("click", function () {
            const confirmDelete = confirm("Bu ROI'yi silmek istediğinizden emin misiniz?");
            if (!confirmDelete) return;

            storedData.forEach(type => {
                if (type.TypeId === typeId) {
                    type.Regions.splice(roiIndex, 1);
                }
            });

            infoBox.remove();
            alert("ROI başarıyla silindi!");
        });
    }


});
