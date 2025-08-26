-- Seed products referencing images in backend/Assets
-- Run this after creating the schema and database (furniture)

INSERT INTO products (sku, title, short_description, description, category, company, price, image, is_active, is_featured)
VALUES
('SKU-LAMP-001', 'Avant-Garde Lamp', 'Unique modern lamp', 'A unique modern lamp that adds personality to any room.', 'Lamp', 'A', 199.99, 'AvantGardeLamp.jpg', TRUE, TRUE),
('SKU-CHAIR-001', 'Chic Chair', 'Stylish comfortable chair', 'Stylish and comfortable chair perfect for lounging.', 'Chair', 'B', 249.99, 'ChicChair.jpg', TRUE, TRUE),
('SKU-TABLE-001', 'Coffee Table', 'Elegant wooden table', 'Elegant wooden table for your living room or office.', 'Table', 'C', 179.99, 'CoffeTable.jpg', TRUE, TRUE),
('SKU-BED-001', 'Comfy Bed', 'Soft and spacious bed', 'Soft and spacious bed for restful sleep every night.', 'Bed', 'A', 399.99, 'ComfyBed.jpg', TRUE, TRUE),
('SKU-SOFA-001', 'Contemporary Sofa', 'Sleek modern sofa', 'A sleek sofa designed for modern spaces.', 'Sofa', 'B', 499.99, 'ContemporarySofa.jpg', TRUE, TRUE),
('SKU-BED-002', 'Cutting-Edge Bed', 'Futuristic bed frame', 'Futuristic bed frame with comfort in mind.', 'Bed', 'C', 449.99, 'CuttingEdgeBed.jpg', TRUE, FALSE),
('SKU-SHELF-001', 'Futuristic Shelves', 'Space-saving shelf unit', 'Space-saving modern shelf unit for storage.', 'Shelf', 'A', 129.99, 'FuturisticShelves.jpg', TRUE, FALSE),
('SKU-TABLE-002', 'Glass Table', 'Clean minimalist table', 'A clean, minimalist glass table for elegance.', 'Table', 'B', 199.99, 'GlassTable.jpg', TRUE, FALSE),
('SKU-BED-003', 'King Bed', 'Spacious king-sized bed', 'Spacious king-sized bed for luxury comfort.', 'Bed', 'C', 549.99, 'KingBed.jpg', TRUE, FALSE),
('SKU-CHAIR-002', 'Lounge Chair', 'Comfortable relaxing chair', 'Comfortable chair perfect for relaxing indoors.', 'Chair', 'A', 229.99, 'LoungChair.jpg', TRUE, FALSE),
('SKU-SHELF-002', 'Minimalist Shelves', 'Minimal design shelves', 'Minimal design, maximum storage efficiency.', 'Shelf', 'B', 139.99, 'MinimalistShelves.jpg', TRUE, FALSE),
('SKU-SOFA-002', 'Modern Sofa', 'Modern 3-seater sofa', 'Modern 3-seater sofa ideal for small apartments.', 'Sofa', 'C', 459.99, 'ModernSofa.jpg', TRUE, FALSE),
('SKU-TABLE-003', 'Modern Table', 'Stylish modern table', 'A stylish table suitable for modern décor.', 'Table', 'A', 219.99, 'ModernTable.jpg', TRUE, FALSE),
('SKU-SOFA-003', 'Reclining Sofa', 'Adjustable reclining sofa', 'Relax fully with this adjustable reclining sofa.', 'Sofa', 'B', 479.99, 'RecliningSofa.jpg', TRUE, FALSE),
('SKU-SOFA-004', 'Sectional Sofa', 'Modular sectional sofa', 'Modular sofa with plenty of seating space.', 'Sofa', 'C', 599.99, 'SectionSofa.jpg', TRUE, FALSE),
('SKU-BED-004', 'Sleek Bed', 'Space-saving bed design', 'A smooth and space-saving bed design.', 'Bed', 'A', 429.99, 'SleekBed.jpg', TRUE, FALSE),
('SKU-CHAIR-003', 'Sleek Chair', 'Premium cushioned chair', 'Sleek chair with premium cushioning.', 'Chair', 'B', 239.99, 'SleekChair.jpg', TRUE, FALSE),
('SKU-TABLE-004', 'Streamlined Table', 'Chrome-finished legs', 'Streamlined table with chrome-finished legs.', 'Table', 'C', 209.99, 'StramlinedTable.jpg', TRUE, FALSE),
('SKU-BED-005', 'Stylish Bed', 'Stylish bedroom bed', 'Stylish bed that brings life to any bedroom.', 'Bed', 'A', 459.99, 'StylishBed.jpg', TRUE, FALSE),
('SKU-KIDS-001', 'Toy Shelf', 'Organize kids toys', 'Perfect for organizing kids\' toys and books.', 'Kids', 'B', 99.99, 'ToyShelf.jpg', TRUE, FALSE),
('SKU-HOTEL-001', 'Hotel Table', 'Durable classy table', 'Durable and classy table for hotel rooms.', 'Table', 'C', 199.99, 'hoteltable.jpg', TRUE, FALSE),
('SKU-ELEC-001', 'Hotel TV', 'Smart TV with apps', 'Smart TV with crystal-clear display and built-in apps.', 'Electronics', 'A', 699.99, 'hoteltv.jpg', TRUE, FALSE),
('SKU-SOFA-005', 'Velvet Sofa', 'Ultra-soft velvet sofa', 'Velvety texture and ultra-soft for luxury seating.', 'Sofa', 'B', 529.99, 'VelvetSofa.jpg', TRUE, FALSE),
('SKU-SHELF-003', 'Wooden Shelves', 'Classic wooden shelves', 'Classic wooden shelves for home or office.', 'Shelf', 'C', 149.99, 'WoodenShelves.jpg', TRUE, FALSE);


