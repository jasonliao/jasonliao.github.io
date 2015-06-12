
var about = document.getElementById('about'),
    pe = document.getElementById('pe'),
    skills = document.getElementById('skills'),
    contact = document.getElementById('contact');

window.onscroll = function() {
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    if(top < 300) {
        about.style.color = "#42afe3";
        pe.style.color = "#fff";
        skills.style.color = "#fff";
        contact.style.color = "#FFF";
    }
    if(top >= 330 && top < 2030) {
        about.style.color = "#fff";
        pe.style.color = "#42afe3";
        skills.style.color = "#fff";
        contact.style.color = "#FFF";
    }
    if(top >= 2030 && top < 2411) {
        about.style.color = "#fff";
        pe.style.color = "#fff";
        skills.style.color = "#42afe3";
        contact.style.color = "#FFF";
    }
    if(top >= 2411) {
        about.style.color = "#fff";
        pe.style.color = "#fff";
        skills.style.color = "#fff";
        contact.style.color = "#42afe3";
    }
}

about.onclick = function() {
    document.body.scrollTop = 0;
}

pe.onclick = function() {
    document.body.scrollTop = 330;
}

skills.onclick = function() {
    document.body.scrollTop = 2030;
}

contact.onclick = function() {
    document.body.scrollTop = 2411;
}

