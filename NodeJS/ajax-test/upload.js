function log(html) {
    document.getElementById('upload-log').innerHTML = html;
}

document.forms.upload.onsubmit = function() {
    var file = this.elements.myfile.files[0];
    if(file) {
        upload(file);
    }
    return false;  // предотвратить дейтсвие по умолчанию
}

function upload(file) {
    var xhr = new XMLHttpRequest();
    xhr.onload = xhr.onerror = function() {
        if(this.status == 200) {
            log("success");
        } else {
            log("error: " + this.status);
        }
    };

    xhr.upload.onprogress = function(e) {
        log(event.loaded + ' / ' + event.total);
    };

    xhr.open("POST", "upload", true);
    xhr.send(file);  // отправляем содержимое POST запросом
    // var formData = new FormData(document.forms.upload);  // будет использован multipart/form-data
    // xhr.send(formData);
}