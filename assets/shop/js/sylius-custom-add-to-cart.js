import 'semantic-ui-css/components/api';
import $ from 'jquery';

$.fn.extend({
  addToCart() {
    const element = this;

    const url = $(element).attr('action');
    const validationElement = $('#sylius-cart-validation-error');
    const flashContainer = $('#flash-messages');
    const cartInfoElement = $('#cart-info');
    element.api({
      method: 'POST',
      on: 'submit',
      cache: false,
      url,
      beforeSend(settings) {
        settings.data = element.serialize();
        return settings;
      },
      
      onSuccess(response) {
        validationElement.addClass('hidden');
        if (flashContainer.length) {
          const successFlash = $('<div>')
            .addClass('ui success message')
            .text('Product successfully added to cart!');
          flashContainer.append(successFlash);

          setTimeout(() => {
            successFlash.fadeOut(() => successFlash.remove());
          }, 5000);
        }

        if (cartInfoElement.length && response.cart) {
          const { itemsCount, total } = response.cart;
          cartInfoElement.find('#cart-items-count').text(itemsCount);
          cartInfoElement.find('#cart-total').text(total);
        }
      },
      onFailure(response) {
        validationElement.removeClass('hidden');
        let validationMessage = '';

        if (response.errors && response.errors.errors) {
          Object.entries(response.errors.errors).forEach(([, message]) => {
            validationMessage += message;
          });
        } else {
          validationMessage = 'An error occurred. Please try again.';
        }

        validationElement.html(validationMessage);
        $(element).removeClass('loading');
      },
    });
  },
});
