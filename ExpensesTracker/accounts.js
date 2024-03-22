function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.message) {
                    alert(response.message);
                } else if (response.error) {
                    document.getElementById('error-message').innerText = response.error;
                }
            } else {
                console.error('Login request failed');
            }
        }
    };

    var data = JSON.stringify({
        username: username,
        password: password
    });

    xhr.send(data);
}
