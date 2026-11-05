// Vastu Vihar model data supplied by the user. Common amenities live in data/amenities.js.
// lib/models-data.ts

const RAFT_FOUNDATION_BENEFITS = [
    "Raft foundations are constructed at shallow depths, requiring less excavation.",
    "They are well-suited for soils with low bearing capacity.",
    "The loads from the superstructure are redistributed across the entire area.",
    "Differential settlement of the soil is minimized."
];

export const projectsData = {

    //complete
    "ananta-bungalow": {
        slug: "ananta-bungalow",
        name: "Ananta Bungalow",
        price: "₹ 50 - 70 Lac",
        minPrice: 50,
        maxPrice: 70,
        description: "ANANTA = INFINITE (अनंत घर, अनंत सपने). Luxury 3 BHK Bungalow with G+1 and exclusive Rooftop Amenities.",
        youtubeId: "fBQ4S7vQ0ws",
        features: [
            "G+1 DUPLEX LIVING WITH ROOFTOP AMENITIES",
            "OPEN PUJA SPACE & PERGOLA ROOFTOP",
            "GYM & YOGA WELLNESS AREA",
            "PRIVATE BALCONIES & FAMILY LOUNGE"
        ],
        benefits: RAFT_FOUNDATION_BENEFITS,
        gallery: [
            "/thumb/Ananta.webp",
            "/ananta/ananta.webp",
            "/ananta/gallery-1.webp",
            "/ananta/gallery-2.webp",
            "/ananta/gallery-3.webp",
            "/ananta/night-view.webp"
        ],
        modelTypes: [
            {
                id: "ananta-default",
                modelName: "Ground, First & Terrace",
                stats: [
                    { label: "Plot Area", value: "1080 - 1104", unit: "sqft" }, // Bihar: 1080 sqft | Jharkhand: 1104 sqft
                    { label: "Built-up", value: 1800, unit: "sqft" },
                    { label: "Carpet Area", value: 1335, unit: "sqft" },
                    { label: "Bedrooms", value: 3 },
                    { label: "Gym with store", value: 1 },
                    { label: "Rooftop with temple", value: 1 },
                    { label: "Bathrooms", value: 3 },
                    { label: "Parking", value: 1 }
                ],
                layouts: [
                    { type: "2D", url: "/ananta/floor-plan_ff_2d.webp", label: "Ground Floor" },
                    { type: "2D", url: "/ananta/floor-plan_g_2d.webp", label: "First Floor" },
                    { type: "2D", url: "/ananta/floor-plan_t_2d.webp", label: "Terrace Floor" },
                    { type: "3D", url: "/ananta/Ground_floor_3d.webp", label: "Ground Floor" },
                    { type: "3D", url: "/ananta/First_floor_3d.webp", label: "First Floor" },
                    { type: "3D", url: "/ananta/Terrace_floor_3d.webp", label: "Terrace Floor" }
                ],
                areaBreakdown: [
                    {
                        categoryName: "Ground Floor",
                        items: [
                            { room: "Parking Space", dimensions: "11.6 x 16.6 sq.ft", features: "Seatout Area + Shoe Rack" },
                            { room: "Living Area", dimensions: "17 x 12 sq.ft", features: "Simple Fall Ceiling + Chandelier" },
                            { room: "Semi Open Kitchen", dimensions: "6 x 11 sq.ft", features: "Breakfast Table + Garden Area" },
                            { room: "1 Room", dimensions: "13 x 11 sq.ft", features: "Office / Study / Guest Room" },
                            { room: "1 Toilet", dimensions: "4.8 x 11", features: "" }
                        ]
                    },
                    {
                        categoryName: "First Floor",
                        items: [
                            { room: "2 Rooms + 2 Bathrooms", dimensions: "Room: 13 x 11; Bathroom: 4.8 x 11", features: "Master Bedroom" },
                            { room: "Family Lounge Area", dimensions: "17 x 12", features: "" },
                            { room: "Front Balcony", dimensions: "13.5 x 3", features: "" },
                            { room: "Front Balcony", dimensions: "10 x 2.6", features: "" }
                        ]
                    },
                    {
                        categoryName: "Rooftop Amenities",
                        items: [
                            { room: "Open terrace", dimensions: "12.7x12", features: "roofing glass" },
                            { room: "Open puja space", dimensions: "4x4", features: "" },
                            { room: "Gym + Yoga space", dimensions: "11.7x11", features: "" },
                            { room: "Store room", dimensions: "6x11", features: "" },
                            { room: "Pergola area", dimensions: "17x12", features: "" }
                        ]
                    },
                    {
                        categoryName: "Setback",
                        items: [
                            { room: "Rear Setback", dimensions: "4'", features: "" },
                            { room: "Side Setback - Left", dimensions: "3'", features: "" },
                            { room: "Side Setback - Right", dimensions: "2'", features: "" },
                            { room: "Front Setback", dimensions: "5'", features: "" }
                        ]
                    }
                ]
            }
        ]
    },

    //complete
    "ceo-bungalow": {
        slug: "ceo-bungalow",
        name: "CEO Bungalow",
        price: "₹ 90 Lac - 1.80 Cr",
        minPrice: 110,
        maxPrice: 180,
        description: "CEO BUNGALOW – Super Luxury Dream Home. 5 BHK | G+1 with Rooftop Amenities.",
        youtubeId: "x52x2VKPUcg",
        features: [
            "40' x 40' PLOT",
            "FIVE SPACIOUS BEDROOMS",
            "TERRACE SWIMMING POOL & GYM",
            "DEDICATED CAR PARKING"
        ],
        benefits: RAFT_FOUNDATION_BENEFITS,
        gallery: [
            "/thumb/CEO.webp",
            "/ceo/ceo.webp",
            "/ceo/modern-home-1.webp",
            "/ceo/modern-home-2.webp",
            "/ceo/modern-home-3.webp",
        ],
        modelTypes: [
            {
                id: "ceo-standard",
                modelName: "Complete Layout (5 BHK)",
                stats: [
                    { label: "Plot Area", value: 1600, unit: "sqft" },
                    { label: "Built-up", value: 2500, unit: "sqft" },
                    { label: "Carpet Area", value: 1810, unit: "sqft" },
                    { label: "Gym", value: 1 },
                    { label: "Bedrooms", value: 5 },
                    { label: "Bathrooms", value: 4 },
                    { label: "Parking", value: 1 },
                ],
                layouts: [
                    // { type: "2D", url: "/ceo/ground-floor-plan.webp", label: "Ground Floor" },
                    // { type: "2D", url: "/ceo/second-floor-plan.webp", label: "Second Floor" },
                    // { type: "2D", url: "/ceo/first-floor-plan.webp", label: "First Floor" },
                    { type: "3D", url: "/ceo/ground-floor.webp", label: "Ground Floor" },
                    { type: "3D", url: "/ceo/first-floor.webp", label: "First Floor" },
                    { type: "3D", url: "/ceo/terrace-floor.webp", label: "Second Floor" }
                ],
                areaBreakdown: [
                    {
                        categoryName: "Ground Floor",
                        items: [
                            { room: "Parking Space", dimensions: "12'-6\" x 15'-0\"" },
                            { room: "Drawing / Dining Room", dimensions: "19'-4\" x 20'-3\"", features: "False Ceiling + Italian Tiles" },
                            { room: "Modular Kitchen", dimensions: "11'-0\" x 13'-0\"", features: "With Dishwasher + Breakfast Table" },
                            { room: "Master Bedroom", dimensions: "10'-6\" x 14'-0\"", features: "Attached Toilet – 10'-6\" x 5'-6\", Italian Tiles" },
                            { room: "Common Bedroom", dimensions: "10'-6\" x 14'-0\"" },
                            { room: "Common Toilet", dimensions: "7'-0\" x 6'-5\"" },
                            { room: "Lawn Area – 2 Nos.", dimensions: "12'-9\" x 7'-10\"" }
                        ]
                    },
                    {
                        categoryName: "First Floor",
                        items: [
                            { room: "Master Bedroom", dimensions: "10'-6\" x 14'-0\"", features: "Attached Toilet – 10'-6\" x 5'-6\" + Balcony – 7'-0\" x 4'-0\"" },
                            { room: "Common Bedroom 1", dimensions: "10'-6\" x 14'-0\"" },
                            { room: "Common Bedroom 2", dimensions: "10'-6\" x 14'-0\"", features: "1 Room Attached Balcony – 7'-0\" x 4'-0\"" },
                            { room: "Common Balcony", dimensions: "12'-4\" x 5'-6\"", features: "Attached hall" },
                            { room: "Common Toilet", dimensions: "7'-0\" x 6'-5\"" },
                            { room: "Living Area", dimensions: "12'-6\" x 17'-0\"" }
                        ]
                    },
                    {
                        categoryName: "Rooftop Amenities",
                        items: [
                            { room: "Gym + Yoga Space", dimensions: "10'-6\" x 13'-0\"", features: "Running Treadmill & Muscular Cycle" },
                            { room: "Swimming Pool", dimensions: "13'-0\" x 6'-5\"", features: "With Filtration System" },
                            { room: "Shower Area", dimensions: "8'-0\" x 4'-0\"" },
                            { room: "Gazebo", dimensions: "13'-0\" x 10'-6\"", features: "Seating Area with Furniture" },
                            { room: "Slant Deck", dimensions: "8'-0\" x 9'-0\"", features: "Beach Style Tiles" }
                        ]
                    }
                ]
            }
        ]
    },


    //complete
    "classic-ceo-bungalow": {
        slug: "classic-ceo-bungalow",
        name: "Classic CEO Bungalow",
        price: "₹ 90 Lac - 1.70 Cr*",
        minPrice: 100,
        maxPrice: 180,
        description: "An exclusive luxury bungalow featuring five bedrooms, elegant interiors, a modern modular kitchen, and a private rooftop retreat with a swimming pool, gym, pergola, and sit-out area. Designed for premium family living with comfort and sophistication.",
        youtubeId: "z91BiGkSOSA",
        features: [
            "1600 SQ. FT. PLOT AREA",
            "2500 SQ. FT. BUILT-UP AREA",
            "5 BHK LUXURY BUNGALOW",
            "MODERN MODULAR KITCHEN",
            "PRIVATE ROOFTOP SWIMMING POOL",
            "ROOFTOP GYM AND PERGOLA",
            "SPACIOUS ELEGANT INTERIORS",
        ],

        benefits: [
            "Private rooftop with swimming pool, gym, and pergola",
            "Abundant natural light and thoughtfully planned spaces",
            "Modern modular kitchen with premium finishes and breakfast counter",
            "Dedicated rooftop gym for convenient home workouts",
            "Private swimming pool for leisure and entertaining",
            "Pergola and sit-out area for relaxation and family gatherings",
            "Raft foundation designed to distribute structural loads across the foundation area",
            "Suitable for soil with low bearing capacity",
            "Reduced excavation requirements due to shallow foundation construction",
            "Helps minimize differential soil settlement",
        ],
        gallery: [
            "/thumb/classic-ceo.webp",
            "/classic-ceo/Classic_CEO1.webp",
            "/classic-ceo/Classic_CEO2.webp",
            "/classic-ceo/Classic_CEO3.webp",
            "/classic-ceo/Classic_CEO_I1.webp",
            "/classic-ceo/Classic_CEO_I2.webp",
            "/classic-ceo/Classic_CEO_I3.webp",
            "/classic-ceo/Classic_CEO_I4.webp",
            "/classic-ceo/Classic_CEO_I5.webp",
            "/classic-ceo/Classic_CEO_I6.webp",
        ],

        modelTypes: [
            {
                id: "ceo-standard",
                modelName: "Complete Layout (5 BHK)",
                stats: [
                    { label: "Plot Area", value: 1600, unit: "sqft" },
                    { label: "Built-up", value: 2500, unit: "sqft" },
                    { label: "Carpet Area", value: 1810, unit: "sqft" },
                    { label: "Bedrooms", value: 5 },
                    { label: "Bathrooms", value: 4 },
                    { label: "Parking", value: 1 },
                ],
                layouts: [
                    { type: "2D", url: "/ceo/ground-floor-plan.webp", label: "Ground Floor" },
                    { type: "2D", url: "/ceo/first-floor-plan.webp", label: "First Floor" },
                    { type: "2D", url: "/ceo/second-floor-plan.webp", label: "Second Floor" },
                    // { type: "3D", url: "/ceo/ground-floor.webp", label: "Ground Floor" },
                    // { type: "3D", url: "/ceo/first-floor.webp", label: "First Floor" },
                    // { type: "3D", url: "/ceo/terrace-floor.webp", label: "Second Floor" }
                ],
                areaBreakdown: [
                    {
                        categoryName: "Ground Floor",
                        items: [
                            { room: "Parking Space", dimensions: "12'-6\" x 15'-0\"" },
                            { room: "Drawing / Dining Room", dimensions: "19'-4\" x 20'-3\"", features: "False Ceiling + Italian Tiles" },
                            { room: "Modular Kitchen", dimensions: "11'-0\" x 13'-0\"", features: "With Dishwasher + Breakfast Table" },
                            { room: "Master Bedroom", dimensions: "10'-6\" x 14'-0\"", features: "Attached Toilet – 10'-6\" x 5'-6\", Italian Tiles" },
                            { room: "Common Bedroom", dimensions: "10'-6\" x 14'-0\"" },
                            { room: "Common Toilet", dimensions: "7'-0\" x 6'-5\"" },
                            { room: "Lawn Area – 2 Nos.", dimensions: "12'-9\" x 7'-10\"" }
                        ]
                    },
                    {
                        categoryName: "First Floor",
                        items: [
                            { room: "Master Bedroom", dimensions: "10'-6\" x 14'-0\"", features: "Attached Toilet – 10'-6\" x 5'-6\" + Balcony – 7'-0\" x 4'-0\"" },
                            { room: "Common Bedroom 1", dimensions: "10'-6\" x 14'-0\"" },
                            { room: "Common Bedroom 2", dimensions: "10'-6\" x 14'-0\"", features: "1 Room Attached Balcony – 7'-0\" x 4'-0\"" },
                            { room: "Common Balcony", dimensions: "12'-4\" x 5'-6\"", features: "Attached hall" },
                            { room: "Common Toilet", dimensions: "7'-0\" x 6'-5\"" },
                            { room: "Living Area", dimensions: "12'-6\" x 17'-0\"" }
                        ]
                    },
                    {
                        categoryName: "Rooftop Amenities",
                        items: [
                            { room: "Gym + Yoga Space", dimensions: "10'-6\" x 13'-0\"", features: "Running Treadmill & Muscular Cycle" },
                            { room: "Swimming Pool", dimensions: "13'-0\" x 6'-5\"", features: "With Filtration System" },
                            { room: "Shower Area", dimensions: "8'-0\" x 4'-0\"" },
                            { room: "Gazebo", dimensions: "13'-0\" x 10'-6\"", features: "Seating Area with Furniture" },
                            { room: "Slant Deck", dimensions: "8'-0\" x 9'-0\"", features: "Beach Style Tiles" }
                        ]
                    }
                ]
            }
        ]
    },

    //yamuna 7bhk
    "yamuna-bungalow-7bhk": {
        slug: "yamuna-bungalow-7bhk",
        name: "Yamuna Bungalow (7 BHK)",
        price: "₹60 Lac - 1 Cr",
        minPrice: 60,
        maxPrice: 100,
        description: "Learn more about this Classic Bungalow. The Yamuna Bungalow 7 BHK layout.",
        youtubeId: "6mSbVDkUPn4",
        features: [
            "CLASSICAL COLUMNED FACADE",
            "7 BHK LAYOUT",
            "35'8\" x 42' PLOT",
            "DEDICATED CAR PARKING"
        ],
        benefits: RAFT_FOUNDATION_BENEFITS,
        gallery: [
            "/thumb/Yamuna-2.jpg",
            "/yamuna/Yamuna.webp",
            "/yamuna/yamuna3.webp",
            "/yamuna/yamuna1.webp",
            "/yamuna/yamuna2.webp",
        ],
        modelTypes: [
            {
                id: "yamuna-7bhk",
                modelName: "Type B (7 BHK)",
                stats: [
                    { label: "Plot Area", value: 1470, unit: "sqft" },
                    { label: "Carpet Area", value: 1680, unit: "sqft" },
                    { label: "Builtup Area", value: 2200, unit: "sqft" },
                    { label: "Bedrooms", value: 7 },
                    { label: "Bathrooms", value: 4 },
                    { label: "Parking", value: 1 },
                    { label: "Hall", value: 2 }
                ],
                layouts: [
                    { type: "2D", url: "/yamuna/gf72d.webp", label: "Ground Floor" },
                    { type: "2D", url: "/yamuna/ff72d.webp", label: "First Floor" },
                    { type: "3D", url: "/yamuna/yamuna_7_gf_3d.webp", label: "Ground Floor" },
                    { type: "3D", url: "/yamuna/yamuna_7_ff_3d.webp", label: "First Floor" },
                ],

                "areaBreakdown": [
                    {
                        "categoryName": "Ground Floor",
                        "items": [
                            { "room": "Portico / Parking", "dimensions": "14'-0\" x 14'-0\"" },
                            { "room": "Dining / Drawing", "dimensions": "10'-0\" x 17'-6\"" },
                            { "room": "Kitchen", "dimensions": "10'-0\" x 8'-4\"" },
                            { "room": "Bed Room 1", "dimensions": "10'-0\" x 13'-8\"" },
                            { "room": "Bed Room 2", "dimensions": "10'-0\" x 13'-10\"" },
                            { "room": "Bed Room 3", "dimensions": "10'-0\" x 13'-11\"" },
                            { "room": "Toilet 1", "dimensions": "5'-0\" x 5'-4\"" },
                            { "room": "Toilet 2", "dimensions": "5'-0\" x 5'-4\"" }
                        ]
                    },
                    {
                        "categoryName": "First Floor",
                        "items": [
                            { "room": "Drawing Hall", "dimensions": "10'-0\" x 18'-1\"" },
                            { "room": "Study Room", "dimensions": "10'-0\" x 8'-4\"" },
                            { "room": "Bed Room 1", "dimensions": "10'-0\" x 13'-8\"" },
                            { "room": "Bed Room 2", "dimensions": "10'-0\" x 13'-10\"" },
                            { "room": "Bed Room 3", "dimensions": "10'-0\" x 13'-11\"" },
                            { "room": "Toilet 1", "dimensions": "5'-0\" x 5'-4\"" },
                            { "room": "Toilet 2", "dimensions": "5'-0\" x 5'-4\"" },
                            { "room": "Front Balcony", "dimensions": "6'-0\" Wide" },
                            { "room": "Balcony 1", "dimensions": "7'-0\" x 4'-0\"" },
                            { "room": "Balcony 2", "dimensions": "7'-0\" x 4'-0\"" }
                        ]
                    }
                ]

            }
        ]
    },


    //yamuna 5bhk
    "yamuna-bungalow": {
        slug: "yamuna-bungalow",
        name: "Yamuna Bungalow (5 BHK)",
        price: "₹55 - 70 Lac*",
        minPrice: 55,
        maxPrice: 70,
        description: "Learn more about this Classic Bungalow. The Yamuna Bungalow 5 BHK layout.",
        youtubeId: "6mSbVDkUPn4",
        features: [
            "CLASSICAL COLUMNED FACADE",
            "5 BHK LAYOUT",
            "40' x 40' PLOT",
            "DEDICATED CAR PARKING"
        ],
        benefits: RAFT_FOUNDATION_BENEFITS,
        gallery: [
            "/thumb/Yamuna.webp",
            "/yamuna/yamuna1.webp",
            "/yamuna/yamuna2.webp",
            "/yamuna/yamuna3.webp"
        ],
        modelTypes: [
            {
                id: "yamuna-5bhk",
                modelName: "Type A (5 BHK)",
                stats: [
                    { label: "Plot Area", value: 1600, unit: "sqft" },
                    { label: "Carpet Area", value: 1680, unit: "sqft" },
                    { label: "Builtup Area", value: 2200, unit: "sqft" },
                    { label: "Bedrooms", value: 5 },
                    { label: "Bathrooms", value: 4 },
                    { label: "Parking", value: 1 },
                    { label: "Hall", value: 2 }
                ],
                layouts: [
                    { type: "2D", url: "/yamuna/yamuna_5_gf_2d.webp", label: "Ground Floor" },
                    { type: "2D", url: "/yamuna/yamuna_5_ff_2d.webp", label: "First Floor" },
                    { type: "3D", url: "/yamuna/5_gf_3d.webp", label: "Ground Floor" },
                    { type: "3D", url: "/yamuna/5_ff_3d.webp", label: "First Floor" }
                ],
                areaBreakdown: [
                    {
                        categoryName: "Ground Floor",
                        items: [
                            { room: "Parking Area", dimensions: "12'-4\" x 15'-0\"" },
                            { room: "Bed Room 1", dimensions: "10'-6\" x 14'-0\"" },
                            { room: "Bed Room 2", dimensions: "10'-6\" x 14'-0\"" },
                            { room: "Toilate 1", dimensions: "7'-0\" x 6'" },
                            { room: "Toilate 2", dimensions: "7'-0\" x 6'" },
                            { room: "Puja Room", dimensions: "7'-0\" x 4'-3\"" },
                            { room: "Kitchen", dimensions: "7'-0\" x 8'-4\"" },
                            { room: "Drawing Cum Di", dimensions: "19'-4\" x 20'-3\"" }
                        ]
                    },
                    {
                        categoryName: "First Floor",
                        items: [
                            { room: "Bed Room 1", dimensions: "10'-6\" x 14'-0\"" },
                            { room: "Bed Room 2", dimensions: "10'-6\" x 14'-0\"" },
                            { room: "Toilet 1", dimensions: "7'-0\" x 6'-1\"" },
                            { room: "Toilet 2", dimensions: "7'-0\" x 6'-6\"" },
                            { room: "Bed Room 3", dimensions: "10'-0\" x 13'-0\"" },
                            { room: "Drawing Cum Di", dimensions: "19'-4\" x 20'-3\"" },
                            { room: "Balcony", dimensions: "12'-4\" x 7'-2\"" },
                            { room: "Wide Balcony 1", dimensions: "7' x 3.5'" },
                            { room: "Wide Balcony 2", dimensions: "7' x 3.5'" }
                        ]
                    }
                ]
            }
        ]
    },

    //complete
    "simplex-bungalow": {
        slug: "simplex-bungalow",
        name: "Simplex Bungalow",
        price: "₹ 30 - 35 Lac*",
        minPrice: 30,
        maxPrice: 35,
        description:
            "A compact 2 BHK home designed for modern living, featuring a spacious hall, kitchen, and comfortable layout that combines simplicity with contemporary style.",

        youtubeId: "w_x03DkwmOY",

        features: [
            "MODERN 2 BHK DESIGN",
            "1000 SQ. FT. PLOT",
            "SPACIOUS HALL AND KITCHEN",
            "SIMPLE, CONTEMPORARY STYLE",
        ],

        benefits: RAFT_FOUNDATION_BENEFITS,
        gallery: [
            "/thumb/Simplex.webp",
            "/simplex/Simplex.webp",
            "/villa/simplex.webp",
            "/simplex/simplex-row-building.webp",
        ],

        modelTypes: [
            {
                id: "simplex-new",
                modelName: "Type A (Simplex New)",
                stats: [
                    { label: "Plot Area", value: 1000, unit: "sqft" },
                    { label: "Built-up Area", value: 1000, unit: "sqft" },
                    { label: "Carpet Area", value: 530, unit: "sqft" },
                    { label: "Bedrooms", value: 2 },
                    { label: "Hall", value: 1 },
                    { label: "Kitchen", value: 1 },
                    { label: "Bathrooms", value: 2 },
                ],
                layouts: [
                    {
                        type: "2D",
                        url: "/simplex/gf2d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "2D",
                        url: "/simplex/ff2d.webp",
                        label: "First Floor",
                    },
                ],
                "areaBreakdown": [
                    {
                        "categoryName": "Ground Floor",
                        "items": [
                            { "room": "Parking Area", "dimensions": "Not Specified" }
                        ]
                    },
                    {
                        "categoryName": "First Floor",
                        "items": [
                            { "room": "Drawing / Dining", "dimensions": "2.92 x 8.71" },
                            { "room": "Open Kitchen", "dimensions": "Not Specified" },
                            { "room": "Bed Room 1", "dimensions": "3.05 x 3.35" },
                            { "room": "Bed Room 2", "dimensions": "3.05 x 3.35" },
                            { "room": "Toilet 1", "dimensions": "1.85 x 1.88" },
                            { "room": "Toilet 2", "dimensions": "1.85 x 1.88" },
                            { "room": "Front Balcony", "dimensions": "4.29 x 0.97" },
                            { "room": "Rear Balcony", "dimensions": "1.83 x 0.91" }
                        ]
                    },
                    {
                        "categoryName": "Terrace Floor",
                        "items": [
                            { "room": "Open Terrace", "dimensions": "Not Specified" },
                            { "room": "Mumty Area", "dimensions": "Not Specified" }
                        ]
                    }
                ]
            },
        ],
    },

    //complete
    "business-bungalow": {
        slug: "business-bungalow",
        name: "Business Bungalow",
        price: "35 - 50Lac",
        minPrice: 35,
        maxPrice: 50,
        description:
            "A spacious multi-floor bungalow designed for modern family living, featuring 3 bedrooms, a drawing hall, dining area, study room, and dedicated parking. Its concrete frame structure and flat-slab design offer a practical, contemporary layout.",
        youtubeId: "uGxMCG1SIq8",
        features: [
            "3 BHK SPACIOUS LAYOUT",
            "1500 SQ. FT. BUILT-UP AREA",
            "1000 SQ. FT. PLOT",
            "2-FLOOR BUNGALOW",
            "DEDICATED STUDY ROOM",
            "Multipurpose Hall Parking",
        ],
        benefits: [
            "Designed to help prevent seepage and dampness",
            "Reinforced concrete frame structure",
            "6-inch-thick concrete slab",
            "Flat-slab design with no beams above head level",
            "Quality plumbing, drainage, sewerage, and electrical fittings",
            "Shallow raft foundation requiring less excavation",
            "Suitable for soil with low bearing capacity",
            "Redistributes structural loads across the foundation",
            "Helps reduce differential soil settlement",
        ],
        gallery: [
            "/thumb/business-bungalow.webp",
            "/business-b/Business_bungalow1.webp",
            "/business-b/Business_bungalow2.webp",
            "/business-b/Business_bungalow3.webp",
            "/business-b/Business_bungalow4.webp",
            "/business-b/Business_bungalow5.webp",
            "/business-b/Business_bungalow6.webp",
            "/business-b/Business_bungalow8.webp",
        ],
        modelTypes: [
            {
                id: "business-bungalow-3bhk",
                modelName: "Type A (3 BHK Business Bungalow)",
                stats: [
                    { label: "Plot Area", value: 1000, unit: "sqft" },
                    { label: "Built-up", value: 1550, unit: "sqft" },
                    { label: "Carpet Area", value: 630, unit: "sqft" },
                    { label: "Bedrooms", value: 2 },
                    { label: "Bathrooms", value: 2 },
                    { label: "Multipurpose-hall-Parking", value: 1 },
                ],
                layouts: [
                    {
                        type: "2D",
                        url: "/business-b/gf_2d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "2D",
                        url: "/business-b/ff_2d.webp",
                        label: "First Floor",
                    },
                    {
                        type: "2D",
                        url: "/business-b/tf_2d.webp",
                        label: "Terrace Floor",
                    },
                    {
                        type: "3D",
                        url: "/business-b/gf3d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "3D",
                        url: "/business-b/ff3d.webp",
                        label: "First Floor",
                    },
                    {
                        type: "3D",
                        url: "/business-b/tarrace_3d.webp",
                        label: "Terrace",
                    },

                ],
                areaBreakdown: [
                    {
                        categoryName: "Ground Floor",
                        items: [
                            { room: "Front Setback", dimensions: "6'-1\"" },
                            { room: "Side Setback", dimensions: "2'-6\"" },
                            { room: "Rear Setback", dimensions: "4'" },
                            { room: "Multipurpose Hall", dimensions: "20'-0\" x 32'-0\"" }
                        ]
                    },
                    {
                        categoryName: "First Floor",
                        items: [
                            { room: "Bed Room 1", dimensions: "10'-0\" x 11'-0\"" },
                            { room: "Bed Room 2", dimensions: "10'-0\" x 11'-0\"" },
                            { room: "Open Kitchen + Drawing / Dining", dimensions: "9'-7\" x 28'-7\"" },
                            { room: "Toilet 1", dimensions: "6'-1\" x 6'-2\"" },
                            { room: "Toilet 2", dimensions: "6'-1\" x 6'-2\"" },
                            { room: "Front Balcony", dimensions: "14'-1\" x 3'-2\"" },
                            { room: "Back Balcony", dimensions: "6'-0\" x 3'-0\"" }
                        ]
                    },
                    {
                        categoryName: "Terrace Floor",
                        items: [
                            { room: "Gajebo Seating", dimensions: "13'-0\" x 12'-0\"" },
                            { room: "Mumty Area", dimensions: "" },
                            { room: "Terrace Area", dimensions: "" }
                        ]
                    }
                ]
            }
        ]
    },
    //complete
    "godawari-bungalow": {
        slug: "godawari-bungalow",
        name: "Godawari Bungalow",
        price: "₹ 30 - 40 Lac*",
        minPrice: 30,
        maxPrice: 40,
        description:
            "A well-designed 2 BHK bungalow offering modern living and comfort on a 1,000 sq. ft. plot, with 900 sq. ft. built-up area and 710 sq. ft. carpet area. The thoughtfully planned layout includes spacious living areas and a practical floor plan for family living.",
        youtubeId: "sx0GPUWDuBQ",
        features: [
            "MODERN 2 BHK DESIGN",
            "1000 SQ. FT. PLOT AREA",
            "900 SQ. FT. BUILT-UP AREA",
            "710 SQ. FT. CARPET AREA",
            "2 BEDROOMS",
            "2 BATHROOMS",
            "SPACIOUS HALL AND KITCHEN",
            "TWO-FLOOR DESIGN",
        ],
        benefits: RAFT_FOUNDATION_BENEFITS,
        gallery: [
            "/thumb/Godavari.webp",
            "/godawari/godawari2.webp",
            "/godawari/godawari1.webp",
        ],
        modelTypes: [
            {
                id: "godawari-2bhk",
                modelName: "Godawari Bungalow - 2BHK",
                stats: [
                    { label: "Plot Area", value: 1000, unit: "sqft" },
                    { label: "Built-up Area", value: 900, unit: "sqft" },
                    { label: "Carpet Area", value: 710, unit: "sqft" },
                    { label: "Bedrooms", value: 2 },
                    { label: "Bathrooms", value: 2 },
                    { label: "Hall", value: 1 },
                    { label: "Kitchen", value: 1 },
                ],
                layouts: [
                    {
                        type: "2D",
                        url: "/godawari/gf_2d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "2D",
                        url: "/godawari/ff_2d.webp",
                        label: "First Floor",
                    },
                    {
                        type: "3D",
                        url: "/godawari/gf_3d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "3D",
                        url: "/godawari/ff_3d.webp",
                        label: "First Floor",
                    },
                ],
                areaBreakdown: [
                    {
                        categoryName: "Ground Floor Plan",
                        items: [
                            { room: "Bed Room 1", dimensions: "9'-7\" x 12'-0\"" },
                            { room: "Bed Room 2", dimensions: "9'-7\" x 12'-0\"" },
                            { room: "Toilet 1", dimensions: "4'-7\" x 5'-9\"" },
                            { room: "Toilet 2", dimensions: "4'-7\" x 5'-9\"" },
                            { room: "Open Kitchen + Drawing / Dining Hall", dimensions: "10'-0\" x 20'-3\"" }
                        ]
                    },
                    {
                        categoryName: "Terrace Floor Plan",
                        items: [
                            { room: "Auxiliary Room", dimensions: "10'-0\" x 8'-5\"" },
                            { room: "Puja Room", dimensions: "3'-10\" x 6'-11\"" },
                            { room: "Cut Out", dimensions: "6\" x 18\"" },
                            { room: "Ht. Parapet Wall", dimensions: "3'-0\"" }
                        ]
                    }
                ]
            }
        ]
    },

    //complete
    "jayanti-bungalow": {
        slug: "jayanti-bungalow",
        name: "Jayanti Bungalow",
        price: "₹ 40 - 50 Lac*",
        minPrice: 40,
        maxPrice: 50,
        description:
            "A thoughtfully designed 3 BHK bungalow offering comfortable living for small and medium-sized families, with spacious bedrooms, inviting balconies, elegant dining spaces, and a practical two-floor layout.",
        youtubeId: "wHHl7NEM2M4",
        features: [
            "3 BHK FAMILY BUNGALOW",
            "1300 SQ. FT. BUILT-UP AREA",
            "SPACIOUS BEDROOMS",
            "ELEGANT DINING AND LIVING AREAS",
            "INVITING BALCONIES",
            "GROUND AND FIRST-FLOOR LAYOUT",
        ],
        benefits: ["Please contact to know more"],
        gallery: [
            "/thumb/Jayanti.jpg",
            "/jayanti/5.webp",
            "/jayanti/1.webp",
            "/jayanti/2.webp",
            // "/jayanti/3.webp",
            // "/jayanti/4.webp",
            "/jayanti/6.webp",
            "/jayanti/8.webp",
        ],
        modelTypes: [
            {
                id: "jayanti-original-3bhk",
                modelName: "Type A (Std.)",
                stats: [
                    { label: "Land Area", value: 900, unit: "sqft" },
                    { label: "Built-up", value: 1300, unit: "sqft" },
                    { label: "Carpet Area", value: 940, unit: "sqft" },
                    { label: "Bedrooms", value: 3 },
                    { label: "Bathrooms", value: 2 },
                    { label: "Hall", value: 1 },
                    { label: "Kitchen", value: 1 },
                ],
                layouts: [
                    {
                        type: "2D",
                        url: "/jayanti/gf_2d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "2D",
                        url: "/jayanti/ff_2d.webp",
                        label: "First Floor",
                    },
                    {
                        type: "3D",
                        url: "/jayanti/gf_3d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "3D",
                        url: "/jayanti/ff_3d.webp",
                        label: "First Floor",
                    },
                ],

                "areaBreakdown": [
                    {
                        "categoryName": "Ground Floor",
                        "items": [
                            { "room": "Parking Area", "dimensions": "2.64 x 3.96" },
                            { "room": "Drawing and Dining", "dimensions": "3.20 x 6.10" },
                            { "room": "Kitchen", "dimensions": "2.08 x 3.05" },
                            { "room": "Bed Room", "dimensions": "3.05 x 3.05" },
                            { "room": "Toilet", "dimensions": "1.93 x 1.52" }
                        ]
                    },
                    {
                        "categoryName": "First Floor",
                        "items": [
                            { "room": "Portico / Balcony", "dimensions": "2.64 x 3.81" },
                            { "room": "Bed Room 1", "dimensions": "3.20 x 4.27" },
                            { "room": "Bed Room 2", "dimensions": "5.26 x 3.05" },
                            { "room": "Toilet", "dimensions": "2.08 x 1.70" }
                        ]
                    }
                ]

            }
        ]
    },


    //complete
    "kaveri-bungalow": {
        slug: "kaveri-bungalow",
        name: "Kaveri Bungalow",
        price: "₹ 35 - 55 Lac*",
        minPrice: 35,
        maxPrice: 55,
        description:
            "A spacious double-storey bungalow designed for single or extended families, featuring four bedrooms, two halls, two kitchens, and single-car parking. Its flexible layout offers comfortable living for one large family or two separate households.",
        youtubeId: "9n4FbqhOQYE",
        features: [
            "4 BHK DOUBLE-STOREY BUNGALOW",
            "1400 SQ. FT. BUILT-UP AREA",
            "1000 SQ. FT. PLOT",
            "2 HALLS AND 2 KITCHENS",
            "SUITABLE FOR TWO FAMILIES",
            "SINGLE-CAR PARKING",
        ],
        benefits: ["Please contact to know more"],
        gallery: [
            "/thumb/Kaveri.webp",
            "/kaveri/1.webp",
            "/kaveri/kaveri-exterior.webp",
            "/kaveri/kaveri-row.webp",
        ],
        modelTypes: [
            {
                id: "kaveri-4bhk",
                modelName: "Kaveri Bungalow (4 BHK)",
                stats: [
                    { label: "Plot Area", value: 1000, unit: "sqft" },
                    { label: "Built-up", value: 1400, unit: "sqft" },
                    { label: "Carpet Area", value: 1060, unit: "sqft" },
                    { label: "Bedrooms", value: 4 },
                    { label: "Halls", value: 2 },
                    { label: "Kitchens", value: 2 },
                    { label: "Bathrooms", value: 2 },
                ],
                layouts: [
                    {
                        type: "2D",
                        url: "/kaveri/Kaveri_row_Ground_Floor.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "2D",
                        url: "/kaveri/Kaveri_row_First_Floor.webp",
                        label: "First Floor",
                    },
                    {
                        type: "3D",
                        url: "/kaveri/gd3d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "3D",
                        url: "/kaveri/ff3d.webp",
                        label: "First Floor",
                    },
                ],
                areaBreakdown: [
                    {
                        categoryName: "Ground Floor",
                        items: [
                            { room: "Parking Area", dimensions: "11'-6\" x 13'-0\"" },
                            { room: "Drawing and Dining Room", dimensions: "10'-5\" x 12'-6\"" },
                            { room: "Kitchen", dimensions: "6'-0\" x 8'-0\"" },
                            { room: "Bed Room 1", dimensions: "10'-0\" x 13'-0\"" },
                            { room: "Bed Room 2", dimensions: "10'-0\" x 13'-5\"" },
                            { room: "Toilet", dimensions: "4'-0\" x 8'-0\"" }
                        ]
                    },
                    {
                        categoryName: "First Floor",
                        items: [
                            { room: "Open Terrace", dimensions: "11'-6\" x 13'-0\"" },
                            { room: "Drawing and Dining Room", dimensions: "10'-5\" x 12'-6\"" },
                            { room: "Kitchen", dimensions: "6'-0\" x 8'-0\"" },
                            { room: "Toilet", dimensions: "4'-0\" x 8'-0\"" },
                            { room: "Bed Room 1", dimensions: "10'-0\" x 13'-5\"" },
                            { room: "Bed Room 2", dimensions: "10'-0\" x 13'-0\"" }
                        ]
                    }
                ]
            }
        ]
    },

    //complete
    "gayatri-row-house": {
        slug: "gayatri-row-house",
        name: "Gayatri Row House",
        price: "₹ 28 - 35 Lac*",
        minPrice: 28,
        maxPrice: 35,
        description:
            "An exclusive bungalow featuring elegant architecture, spacious living areas, and refined craftsmanship. The thoughtfully designed kitchen opens into the dining and main living areas, while two bedrooms are situated on the first floor.",
        youtubeId: "",
        features: [
            "2 BHK Row House",
            "805 Sqft Plot Area",
            "1300 Sqft Built-up Area",
            "2 Bedrooms",
            "2 Bathrooms",
            "1 Hall",
            "1 Kitchen",
            "Two-Storey Layout",
        ],
        benefits: ["please contact to know more"],
        gallery: [
            "/thumb/Gayatri.webp",
            "/gayatri/thumb.webp",
        ],
        modelTypes: [
            {
                id: "gayatri-row-house-2bhk",
                modelName: "Gayatri Row House - 2 BHK",
                stats: [
                    { label: "Plot Area", value: 805, unit: "sqft" },
                    { label: "Built-up Area", value: 1300, unit: "sqft" },
                    { label: "Carpet Area", value: 765, unit: "sqft" },
                    { label: "Bedrooms", value: 2 },
                    { label: "Bathrooms", value: 2 },
                    { label: "Hall", value: 1 },
                    { label: "Kitchen", value: 1 },
                ],
                layouts: [
                    {
                        type: "2D",
                        url: "/gayatri/gf2d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "2D",
                        url: "/gayatri/ff2d.webp",
                        label: "First Floor",
                    },
                    {
                        type: "3D",
                        url: "/gayatri/gf_3d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "3D",
                        url: "/gayatri/ff_3d.webp",
                        label: "First Floor",
                    },
                ],
                "areaBreakdown": [
                    {
                        "categoryName": "Ground Floor",
                        "items": [
                            {
                                "room": "Drawing / Dining",
                                "dimensions": "10'-3\" x 23'-11\"",
                            },
                            {
                                "room": "Toilet",
                                "dimensions": "8'-0\" x 4'-6\"",
                            },
                            {
                                "room": "Portico / Parking",
                                "dimensions": "8'-5\" x 12'-0\"",
                            }
                        ]
                    },
                    {
                        "categoryName": "First Floor",
                        "items": [
                            {
                                "room": "Bed Room 1",
                                "dimensions": "10'-3\" x 11'-6\"",
                            },
                            {
                                "room": "Bed Room 2",
                                "dimensions": "10'-3\" x 12'-1\"",
                            },
                            {
                                "room": "Toilet",
                                "dimensions": "8'-0\" x 4'-6\"",
                            },
                            {
                                "room": "Balcony",
                                "dimensions": "8'-5\" x 5'-0\"",
                            }
                        ]
                    }
                ]

            },
        ],
    },


    // complete
    'rainbow-house-bungalow': {
        slug: "rainbow-house-bungalow",
        name: "Rainbow Row House",
        price: "₹ 35 - 45 Lac*",
        minPrice: 35,
        maxPrice: 45,
        description:
            "A spacious three-floor luxury bungalow designed with a strong concrete frame structure, flat slab construction, and raft foundation. Featuring four bedrooms, five bathrooms, a shop or parking space, and a rooftop pool, it combines modern amenities with durable construction.",
        youtubeId: "",
        features: [
            "3 BHK LUXURY BUNGALOW",
            "700 SQFT PLOT AREA",
            "2000 SQFT BUILT-UP AREA",
            "1530 SQFT CARPET AREA",
            "5 BATHROOMS",
            "SHOP ON DEMAND",
            "ROOFTOP POOL",
            "SOCIETY GARDEN",
            "FLAT SLAB CONSTRUCTION",
            "RAFT FOUNDATION",
        ],
        benefits: [
            "Raft foundation requires less excavation due to its shallow construction.",
            "Suitable for soil with low bearing capacity.",
            "Distributes structural loads across the foundation area.",
            "Helps minimize differential soil settlement.",
            "Concrete frame structure with six 4 × 4 ft columns and four 4 × 20 inch columns.",
            "6-inch-thick concrete slab, reducing the need for a false ceiling.",
            "Flat slab design with no beams above head level.",
            "Designed to help prevent seepage and dampness.",
            "Quality plumbing, drainage, sewerage, and electrical fixtures.",
        ],
        gallery: [
            "/thumb/Rainbow.webp",
            "/rainbow/gallery-rainbow-1.webp",
            "/rainbow/gallery-rainbow-2.webp",
            "/rainbow/gallery-rainbow-4.webp",
            "/rainbow/gallery-rainbow-5.webp",
            "/rainbow/gallery-rainbow-6.webp",
            "/rainbow/gallery-rainbow-7.webp",
            "/rainbow/gallery-rainbow-8.webp",
        ],
        modelTypes: [
            {
                id: "rainbow-house-3bhk",
                modelName: "Rainbow House - 3 BHK",
                stats: [
                    { label: "Plot Area", value: 700, unit: "sqft" },
                    { label: "Built-up Area", value: 2000, unit: "sqft" },
                    { label: "Carpet Area", value: 1530, unit: "sqft" },
                    { label: "Bedrooms", value: 3 },
                    { label: "Bathrooms", value: 5 },
                    { label: "Parking / Shop", value: 1 },
                ],
                layouts: [
                    {
                        type: "2D",
                        url: "/rainbow/layout.webp",
                    },
                ],

                "areaBreakdown": [
                    {
                        "categoryName": "Ground Floor",
                        "items": [
                            { "room": "Parking", "dimensions": "16'-0\" x 23'-6\"" },
                            { "room": "Bed Room", "dimensions": "11'-7\" x 11'-4\"" },
                            { "room": "Toilet", "dimensions": "4'-0\" x 7'-8\"" },
                            { "room": "Verandah", "dimensions": "3'-0\" Wide" }
                        ]
                    },
                    {
                        "categoryName": "First Floor",
                        "items": [
                            { "room": "Living Room", "dimensions": "16'-0\" x 18'-1\"" },
                            { "room": "Bed Room", "dimensions": "11'-7\" x 11'-4\"" },
                            { "room": "Toilet", "dimensions": "4'-0\" x 7'-8\"" },
                            { "room": "Kitchen", "dimensions": "Not Specified" },
                            { "room": "Puja", "dimensions": "Not Specified" },
                            { "room": "Front Balcony", "dimensions": "Not Specified" },
                            { "room": "Rear Balcony", "dimensions": "Not Specified" }
                        ]
                    },
                    {
                        "categoryName": "Second Floor",
                        "items": [
                            { "room": "Bed Room", "dimensions": "16'-0\" x 14'-4\"" },
                            { "room": "Wardrobe", "dimensions": "Not Specified" },
                            { "room": "Front Balcony", "dimensions": "3'-2\" Wide" },
                            { "room": "Rear Balcony", "dimensions": "Not Specified" }
                        ]
                    }
                ]

            },
        ],
    },

    //complete
    "ambika-bungalow": {
        slug: "ambika-bungalow",
        name: "Ambika G+2",
        price: "₹ 40 - 50 Lac",
        minPrice: 40,
        maxPrice: 50,
        description:
            "Ambika Bungalow is a three-floor home designed for comfortable modern living, offering 4 bedrooms, a dedicated study room, and parking. Its concrete frame structure, flat slab design, and raft foundation provide a durable construction approach, complemented by quality plumbing, drainage, sewerage, and electrical fittings.",
        youtubeId: "",

        features: [
            "4 BEDROOM BUNGALOW",
            "1000 SQFT PLOT AREA",
            "2100 SQFT BUILT-UP AREA",
            "1246 SQFT CARPET AREA",
            "3 FLOORS",
            "2 BATHROOMS",
            "1 STUDY ROOM",
            "1 PARKING SPACE",
            "CONCRETE FRAME STRUCTURE",
            "FLAT SLAB DESIGN",
            "RAFT FOUNDATION",
        ],

        benefits: [
            "Designed to help reduce seepage and dampness.",
            "Concrete frame structure with six 4 × 4 ft columns and four 4 × 20 inch columns.",
            "6-inch-thick concrete slab, reducing the need for a false ceiling.",
            "Flat slab design without beams above head level.",
            "Quality plumbing, drainage, sewerage, and electrical fittings.",
            "Shallow raft foundation requires less excavation.",
            "Suitable for soil with low bearing capacity.",
            "Distributes structural loads across the foundation area.",
            "Helps reduce differential soil settlement.",
        ],
        gallery: [
            "/thumb/Ambika.webp",
            "/ambika/thumb.webp",
        ],

        modelTypes: [
            {
                id: "ambika-bungalow-4bhk",
                modelName: "Ambika Bungalow - 4 BHK",
                stats: [
                    { label: "Plot Area", value: 1000, unit: "sqft" },
                    { label: "Built-up Area", value: 2100, unit: "sqft" },
                    { label: "Carpet Area", value: 1246, unit: "sqft" },
                    { label: "Bedrooms", value: 4 },
                    { label: "Bathrooms", value: 2 },
                    { label: "Dining", value: 1 },
                    { label: "Parking Spaces", value: 1 },
                ],
                layouts: [



                    {
                        type: "2D",
                        url: "/ambika/gf2d.webp",
                        label: "Ground Floor",
                    },


                    {
                        type: "2D",
                        url: "/ambika/1st2d.webp",
                        label: "First Floor",
                    },


                    {
                        type: "2D",
                        url: "/ambika/2nd2d.webp",
                        label: "Second Floor",
                    },


                    {
                        type: "3D",
                        url: "/ambika/groundfloor3d.webp",
                        label: "Ground Floor",
                    },
                    {
                        type: "3D",
                        url: "/ambika/1stfloor3d.webp",
                        label: "First Floor",
                    },
                    {
                        type: "3D",
                        url: "/ambika/2ndfloor3d.webp",
                        label: "Second Floor",
                    },
                ],
                "areaBreakdown": [
                    {
                        "categoryName": "Ground Floor",
                        "items": [
                            { "room": "Parking Area", "dimensions": "Not Specified" },
                            { "room": "Bed Room", "dimensions": "3.91 x 3.05" },
                            { "room": "Toilet", "dimensions": "1.22 x 3.05" },
                            { "room": "Rear Balcony", "dimensions": "0.91 Wide" }
                        ]
                    },
                    {
                        "categoryName": "First Floor",
                        "items": [
                            { "room": "Dining / Drawing", "dimensions": "3.12 x 6.10" },
                            { "room": "Kitchen", "dimensions": "2.01 x 2.74" },
                            { "room": "Bed Room", "dimensions": "3.91 x 3.05" },
                            { "room": "Toilet", "dimensions": "1.22 x 3.05" },
                            { "room": "Front Balcony", "dimensions": "1.83 x 0.91" },
                            { "room": "Rear Balcony", "dimensions": "0.91 Wide" }
                        ]
                    },
                    {
                        "categoryName": "Second Floor",
                        "items": [
                            { "room": "Lobby Room", "dimensions": "3.12 x 2.31" },
                            { "room": "Master Bed Room", "dimensions": "3.12 x 3.66" },
                            { "room": "Bed Room", "dimensions": "3.91 x 3.05" },
                            { "room": "Store Room", "dimensions": "2.01 x 2.74" },
                            { "room": "Toilet", "dimensions": "1.22 x 3.05" },
                            { "room": "Front Balcony", "dimensions": "1.83 x 0.91" },
                            { "room": "Rear Balcony", "dimensions": "0.91 Wide" }
                        ]
                    }
                ]

            },
        ],
    },

    // complete
    "ganga-new-2bhk": {
        slug: "ganga-new-2bhk",
        name: "Ganga New 2 BHK",
        price: "₹ 10 - 16 Lac*",
        minPrice: 10,
        maxPrice: 16,
        description:
            "A practical 2BHK Apartment with an open kitchen and spacious layouts. Designed to combine comfort, affordability, and great value in every location.",
        youtubeId: "",
        features: [
            "COMPACT 2 BHK APARTMENT",
            "700 SQ. FT. SUPER BUILT-UP AREA",
            "510 SQ. FT. BUILT-UP AREA",
            "450 SQ. FT. CARPET AREA",
            "OPEN KITCHEN CONCEPT",
            "DEDICATED PARKING SPACE",
        ],
        benefits: ["please contact for benifits"],
        gallery: [
            "/thumb/Ganga.jpg",
            "/ganga/thumb.webp",
        ],
        modelTypes: [
            {
                id: "ganga-new-2bhk",
                modelName: "Ganga New 2 BHK",
                stats: [
                    { label: "Super Builtup Area", value: 700, unit: "sqft" },
                    { label: "Built-up Area", value: 510, unit: "sqft" },
                    { label: "Carpet Area", value: 450, unit: "sqft" },
                    { label: "Bathrooms", value: 2 },
                    { label: "Bedrooms", value: 2 },
                    { label: "Parking", value: 1 },
                ],
                layouts: [
                    {
                        type: "3D",
                        url: "/ganga/3d.webp",
                        label: "2 BHK Floor Plan",
                    },
                    {
                        type: "2D",
                        url: "/ganga/3d-2.webp",
                        label: "2 BHK Floor Plan",
                    },
                ],
                "areaBreakdown": [
                    {
                        "categoryName": "Unit Layout (Variant A - Upper)",
                        "items": [
                            { "room": "Dining / Drawing", "dimensions": "5.39 x 2.74" },
                            { "room": "Bed Room 1", "dimensions": "3.66 x 2.74" },
                            { "room": "Bed Room 2", "dimensions": "3.66 x 2.74" },
                            { "room": "Open Kitchen", "dimensions": "2.00 x 1.52" },
                            { "room": "Toilet", "dimensions": "1.93 x 1.40" },
                            { "room": "Balcony", "dimensions": "0.91 Wide" }
                        ]
                    },
                    {
                        "categoryName": "Unit Layout (Variant B - Lower)",
                        "items": [
                            { "room": "Dining / Drawing", "dimensions": "4.19 x 3.05" },
                            { "room": "Bed Room 1", "dimensions": "3.05 x 3.35" },
                            { "room": "Bed Room 2", "dimensions": "3.05 x 3.35" },
                            { "room": "Open Kitchen", "dimensions": "2.00 x 1.52" },
                            { "room": "Toilet", "dimensions": "1.93 x 1.40" },
                            { "room": "Balcony", "dimensions": "0.91 Wide" }
                        ]
                    }
                ]
            },
        ],
    },

    //complete
    "aditi": {
        slug: "aditi",
        name: "Aditi 1.0",
        price: "16 - 24Lac",
        minPrice: 16,
        maxPrice: 24,
        description:
            "Modern apartments designed for comfortable living, combining thoughtful layouts, contemporary design, and a peaceful residential environment. The 3 BHK configuration includes bedrooms, a living and dining area, a kitchen, bathrooms, and a balcony.",
        youtubeId: "",
        features: [
            "3 BHK APARTMENT OPTIONS",
            "MODERN LIVING AND DINING SPACE",
            "DEDICATED KITCHEN",
            "BALCONY IN 3 BHK LAYOUT",
            "PARKING AVAILABLE",
        ],
        benefits: ["Please contact to know more"],
        gallery: [
            "/thumb/Aditi.webp",
            "/aditi/thumb.webp"
        ],
        modelTypes: [
            {
                id: "apartment-3bhk-type-a",
                modelName: "Type A (3 BHK Apartment)",
                stats: [
                    { label: "Builtup Area", value: 750, unit: "sqft" },
                    { label: "Carpet Area", value: 670, unit: "sqft" },
                    { label: "Super Builtup Area", value: 1100, unit: "sqft" },
                    { label: "Bedrooms", value: 3 },
                    { label: "Bathrooms", value: 2 },
                    { label: "Hall", value: 1 },
                    { label: "Kitchen", value: 1 },
                    { label: "Balcony", value: 1 },
                    { label: "Parking", value: 1 },
                ],
                layouts: [
                    {
                        type: "2D",
                        url: "/aditi/fl2d.webp",
                    }, {
                        type: "2D",
                        url: "/aditi/tp2d.webp",
                    }, {
                        type: "3D",
                        url: "/aditi/typical_pf_3d.webp",
                    },
                    {
                        type: "3D",
                        url: "/aditi/fp_ind_3d.webp",
                    },
                ],
            }
        ],
    },
    // complete
    "nano": {
        slug: "nano",
        name: "Nano Apartment",
        price: "7 - 15 Lac",
        minPrice: 7,
        maxPrice: 15,
        description:
            "A compact and efficient apartment offering a comfortable living space with an open kitchen, hall, and bedroom. Designed to combine comfort, affordability, and great value in every location.",
        youtubeId: "",
        features: [
            "1 BHK APARTMENT LAYOUT",
            "325 SQ. FT. CARPET AREA",
            "350 SQ. FT. BUILT-UP AREA",
            "500 SQ. FT. SUPER BUILT-UP AREA",
            "OPEN KITCHEN CONCEPT",
            "EFFICIENT SPACE UTILIZATION",
        ],
        benefits: [
            "Affordable and great value in every location",
            "Optimized space layout for maximum utility",
            "High-quality plumbing and electrical fittings",
            "Ideal for individuals or small families",
        ],
        gallery: [
            "/thumb/Nano.webp",
            "/nano/thumb.webp",
        ],
        modelTypes: [
            {
                id: "nano-1bhk",
                modelName: "Nano Apartment (1 BHK)",
                stats: [
                    { label: "Carpet Area", value: 325, unit: "sqft" },
                    { label: "Built-up", value: 350, unit: "sqft" },
                    { label: "Super Built-up", value: 500, unit: "sqft" },
                    { label: "Bedrooms", value: 1 },
                    { label: "Bathrooms", value: 1 },
                    { label: "Balcony", value: 1 },
                ],
                layouts: [
                    {
                        type: "2D",
                        url: "/nano/2d.webp",
                        label: "Floor Plan",
                    },
                    {
                        type: "3D",
                        url: "/nano/fp_3d.webp",
                        label: "3D Layout",
                    },
                ],
                areaBreakdown: [
                    {
                        categoryName: "Unit Layout",
                        items: [
                            { room: "Hall", dimensions: "10'-0\" x 16'-0\"" },
                            { room: "Bed Room", dimensions: "10'-0\" x 10'-0\"" },
                            { room: "Kitchen", dimensions: "Open Layout" },
                            { room: "Toilet", dimensions: "4'-0\" x 6'-0\"" },
                            { room: "Balcony", dimensions: "4'-0\" x 4'-6\"" }
                        ]
                    }
                ]
            },
        ],
    },



};

export async function getProjectModelBySlug(slug) {
    const project = projectsData[slug];
    return project || null;
}

export async function getSuggestedProjects(currentSlug) {
    const allProjects = Object.values(projectsData);
    const suggestions = allProjects.filter(project => project.slug !== currentSlug);

    return suggestions;
}
