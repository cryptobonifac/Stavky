-- Update default activation messages to include the IBAN value after the word "IBAN"
UPDATE public.activation_settings
SET
  message_en = 'To activate your account, please transfer the subscription fee to the following IBAN SK04 0900 0000 0006 5313 0128. Once we confirm your payment, your account will be activated.',
  message_cs = 'Pro aktivaci uctu prosim prevedte castku predplatneho na nasledujici IBAN SK04 0900 0000 0006 5313 0128. Jakmile potvrdime vasi platbu, vas ucet bude aktivovan.',
  message_sk = 'Pre aktivaciu uctu prosim prevedte ciastku predplatneho na nasledujuci IBAN SK04 0900 0000 0006 5313 0128. Hned ako potvrdime vasu platbu, vas ucet bude aktivovany.';
