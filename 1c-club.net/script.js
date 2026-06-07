(function () {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');

    if (!burger || !nav) return;

    burger.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
})();
