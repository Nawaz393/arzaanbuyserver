const paypal = require('paypal-rest-sdk');


paypal.configure({
    'mode': 'sandbox', // or 'live'
    'client_id': 'AZA77Le2kJ-HhdBnSiH2Y4CZuq3ts1ptVZ5iSP8vo-AM4AvoB--rIoiIlF1-H43MJp9_9aLw78fWLG97',
    'client_secret': 'EKA5bhNrwRbesTyzIln2mmrlz_txwQbjh63yMuCDPb6OyRq_lCGZK-pECT3xtU5AUGFrcEmDJ5-uHx9Q'
  });


  module.exports = paypal;

