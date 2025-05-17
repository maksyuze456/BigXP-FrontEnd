document.addEventListener('DOMContentLoaded', async () => {

    const headerRes = await fetch('../forside/header.html');
    const headerHtml = await headerRes.text();
    document.getElementById('header').innerHTML = headerHtml;

    const footerRes = await fetch('../forside/footer.html');
    const footerHtml = await footerRes.text();
    document.getElementById('footer').innerHTML = footerHtml;

})