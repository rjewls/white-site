-- Delivery Fees Only - Quick Setup for Algeria
-- Use this if you only need to add delivery fees to an existing database

-- Insert default delivery fees for all 48 Algerian wilayas
INSERT INTO public.delivery_fees (wilaya_code, wilaya_name, home_delivery, stopdesk_delivery) VALUES
(1, 'Adrar', 800, 600),
(2, 'Chlef', 600, 400),
(3, 'Laghouat', 700, 500),
(4, 'Oum El Bouaghi', 600, 400),
(5, 'Batna', 600, 400),
(6, 'Béjaïa', 600, 400),
(7, 'Biskra', 700, 500),
(8, 'Béchar', 900, 700),
(9, 'Blida', 500, 350),
(10, 'Bouira', 600, 400),
(11, 'Tamanrasset', 1200, 1000),
(12, 'Tébessa', 700, 500),
(13, 'Tlemcen', 700, 500),
(14, 'Tiaret', 650, 450),
(15, 'Tizi Ouzou', 550, 400),
(16, 'Alger', 400, 300),
(17, 'Djelfa', 700, 500),
(18, 'Jijel', 600, 400),
(19, 'Sétif', 600, 400),
(20, 'Saïda', 700, 500),
(21, 'Skikda', 600, 400),
(22, 'Sidi Bel Abbès', 700, 500),
(23, 'Annaba', 650, 450),
(24, 'Guelma', 650, 450),
(25, 'Constantine', 600, 400),
(26, 'Médéa', 550, 400),
(27, 'Mostaganem', 650, 450),
(28, 'M\'Sila', 650, 450),
(29, 'Mascara', 650, 450),
(30, 'Ouargla', 800, 600),
(31, 'Oran', 600, 400),
(32, 'El Bayadh', 750, 550),
(33, 'Illizi', 1000, 800),
(34, 'Bordj Bou Arréridj', 600, 400),
(35, 'Boumerdès', 500, 350),
(36, 'El Tarf', 700, 500),
(37, 'Tindouf', 1100, 900),
(38, 'Tissemsilt', 650, 450),
(39, 'El Oued', 750, 550),
(40, 'Khenchela', 650, 450),
(41, 'Souk Ahras', 650, 450),
(42, 'Tipaza', 500, 350),
(43, 'Mila', 600, 400),
(44, 'Aïn Defla', 600, 400),
(45, 'Naâma', 800, 600),
(46, 'Aïn Témouchent', 700, 500),
(47, 'Ghardaïa', 750, 550),
(48, 'Relizane', 650, 450)
ON CONFLICT (wilaya_code) DO UPDATE SET
    home_delivery = EXCLUDED.home_delivery,
    stopdesk_delivery = EXCLUDED.stopdesk_delivery,
    updated_at = NOW();

-- Verification
SELECT wilaya_code, wilaya_name, home_delivery, stopdesk_delivery 
FROM delivery_fees 
ORDER BY wilaya_code;
