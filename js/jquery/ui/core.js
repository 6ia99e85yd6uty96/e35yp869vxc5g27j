(new CookieConsent()).init();
var orderForm = new OrderForm();
orderForm.init();
document.addEventListener('DOMContentLoaded', function () {
    orderForm.init();
    orderForm.listenMessages();
});