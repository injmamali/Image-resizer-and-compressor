// ===============================
// Image Resizer & Compressor
// script.js
// ===============================

const imageInput = document.getElementById("imageInput");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");

const previewArea = document.getElementById("previewArea");
const previewImage = document.getElementById("previewImage");

const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

const targetSize = document.getElementById("targetSize");

const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const originalSize = document.getElementById("originalSize");
const resolution = document.getElementById("resolution");

const oldSize = document.getElementById("oldSize");
const newSize = document.getElementById("newSize");
const savedPercent = document.getElementById("savedPercent");

let selectedFile = null;
let downloadBlob = null;

// Browse
browseBtn.onclick = () => imageInput.click();

// Upload
imageInput.onchange = (e) => {
    if (e.target.files.length)
        loadImage(e.target.files[0]);
};

// Drag Drop
dropArea.addEventListener("dragover", e => {
    e.preventDefault();
    dropArea.style.borderColor = "#16a34a";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "#4f46e5";
});

dropArea.addEventListener("drop", e => {
    e.preventDefault();
    dropArea.style.borderColor = "#4f46e5";

    if (e.dataTransfer.files.length)
        loadImage(e.dataTransfer.files[0]);
});

// Quality Text
qualitySlider.oninput = () => {
    qualityValue.innerHTML = qualitySlider.value + "%";
};

// Load Image
function loadImage(file){

    selectedFile = file;

    originalSize.innerHTML = formatSize(file.size);
    oldSize.innerHTML = formatSize(file.size);

    const reader = new FileReader();

    reader.onload = function(e){

        previewImage.src = e.target.result;

        previewImage.onload = function(){

            previewArea.style.display = "block";

            widthInput.value = previewImage.naturalWidth;
            heightInput.value = previewImage.naturalHeight;

            resolution.innerHTML =
                previewImage.naturalWidth +
                " × " +
                previewImage.naturalHeight;
        }

    }

    reader.readAsDataURL(file);

}

// Compress
compressBtn.onclick = () => {

    if(!selectedFile){

        alert("Please Select Image");

        return;

    }

    progressText.innerHTML="Compressing...";
    progressBar.style.width="20%";

    const img = new Image();

    img.onload = function(){

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = Number(widthInput.value);
        canvas.height = Number(heightInput.value);

        ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
        );

        let quality = qualitySlider.value/100;
        const target = Number(targetSize.value)*1024;

        compressLoop(canvas,quality,target);

    }

    img.src = previewImage.src;

};

// Compression Loop
function compressLoop(canvas,quality,target){

    canvas.toBlob(function(blob){

        if(blob.size>target && quality>0.05){

            quality-=0.05;

            progressBar.style.width =
            Math.min(90,(quality*100))+"%";

            compressLoop(canvas,quality,target);

            return;

        }

        downloadBlob=blob;

        progressBar.style.width="100%";
        progressText.innerHTML="Completed";

        newSize.innerHTML=formatSize(blob.size);

        let save=((selectedFile.size-blob.size)
/selectedFile.size)*100;

        savedPercent.innerHTML=
        save.toFixed(1)+"%";

        downloadBtn.disabled=false;

    },"image/jpeg",quality);

}

// Download
downloadBtn.onclick=()=>{

    if(!downloadBlob)return;

    const a=document.createElement("a");

    a.href=URL.createObjectURL(downloadBlob);

    a.download="compressed-image.jpg";

    a.click();

    URL.revokeObjectURL(a.href);

}

// Size Format
function formatSize(bytes){

    if(bytes<1024)
        return bytes+" B";

    if(bytes<1024*1024)
        return (bytes/1024).toFixed(1)+" KB";

    return (bytes/1024/1024).toFixed(2)+" MB";

}