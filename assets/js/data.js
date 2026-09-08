/* Hoa Tay Viet — catalog data. Single source of truth for categories & products. */

const CATEGORIES = [
  {
    slug: "cruise-yachts",
    icon: "cruise",
    name: { vi: "Tàu Du Lịch – Du Thuyền", en: "Cruise Ships & Yachts" },
    blurb: {
      vi: "Du thuyền và tàu du lịch nhiều tầng, boong đèn chiếu sáng",
      en: "Multi-deck cruise liners and motor yachts, cabins lit from within",
    },
  },
  {
    slug: "modern-yachts",
    icon: "modern",
    name: { vi: "Du Thuyền Hiện Đại", en: "Modern Yachts" },
    blurb: {
      vi: "Du thuyền và ca-nô kiểu dáng đương đại, thân bo khí động",
      en: "Contemporary motor yachts and runabouts, streamlined hull lines",
    },
  },
  {
    slug: "cargo-ships",
    icon: "cargo",
    name: { vi: "Tàu Chở Hàng", en: "Cargo Ships" },
    blurb: {
      vi: "Tàu chở hàng và tàu kéo, chi tiết cần cẩu và khoang hàng",
      en: "Freighters and tugs, with working detail on booms and holds",
    },
  },
  {
    slug: "sailing-ships",
    icon: "sail",
    name: { vi: "Thuyền Buồm", en: "Sailing Ships" },
    blurb: {
      vi: "Thuyền buồm cổ điển, buộc dây lèo và căng buồm thủ công",
      en: "Tall ships and schooners, hand-rigged line by line",
    },
  },
  {
    slug: "leisure-boats",
    icon: "rowboat",
    name: { vi: "Thuyền (Dùng Đi Dạo)", en: "Rowing & Leisure Boats" },
    blurb: {
      vi: "Xuồng và thuyền nhỏ, phù hợp trang trí không gian ấm cúng",
      en: "Small craft sized for a shelf, a desk, or a reading nook",
    },
  },
  {
    slug: "furniture",
    icon: "furniture",
    name: { vi: "Nội Thất", en: "Nautical Furniture" },
    blurb: {
      vi: "Bàn, tủ và quầy bar tạo hình thân tàu, đóng thủ công",
      en: "Desks, cabinets and bar counters shaped like a hull, built to use",
    },
  },
  {
    slug: "other",
    icon: "other",
    name: { vi: "Sản Phẩm Khác", en: "Other Handcrafted Pieces" },
    blurb: {
      vi: "Pháo thuyền, tranh nổi và kỷ niệm chương chạm khắc tay",
      en: "Cannons, relief wall art and carved commemorative plaques",
    },
  },
];

const PRODUCTS = [
  // ---- Cruise Ships & Yachts ----
  {
    slug: "callista",
    name: "Callista",
    categories: ["cruise-yachts", "modern-yachts"],
    image: "assets/img/products/callista-mo-hinh-thuen.gif",
    price: 289,
    spec: { length: "70 cm", scale: "1:110" },
    desc: {
      vi: "Du thuyền máy cổ điển, thân bo cong và cabin gỗ đánh bóng, dáng dấp một chiếc du thuyền tư nhân thập niên 1960.",
      en: "A classic motor yacht with a swept hull and a polished timber cabin, styled after a private 1960s cruiser.",
    },
  },
  {
    slug: "broom-35-european",
    name: "Broom 35 European",
    categories: ["cruise-yachts", "modern-yachts"],
    image: "assets/img/products/broom-35-european-mo-hinh-tau-thuyen.gif",
    price: 259,
    spec: { length: "68 cm", scale: "1:100" },
    desc: {
      vi: "Mô phỏng dòng du thuyền sông Broom 35, boong lái mở và kính chắn gió cong đặc trưng.",
      en: "A model of the Broom 35 river cruiser, with an open flybridge and its signature curved windscreen.",
    },
  },
  {
    slug: "asuka-ii",
    name: "Asuka II",
    categories: ["cruise-yachts"],
    image: "assets/img/products/asuka-ll-mo-hinh-tau-asuka-ll.gif",
    price: 419,
    spec: { length: "90 cm", scale: "1:150" },
    desc: {
      vi: "Tàu du lịch viễn dương, cửa sổ cabin lắp đèn LED có thể bật sáng như tàu thật.",
      en: "An ocean liner replica with LED-lit cabin windows that switch on, just like the ship she's modeled on.",
    },
  },
  {
    slug: "mississippi",
    name: "Mississippi",
    categories: ["cruise-yachts"],
    image: "assets/img/products/mississippi-mo-hinh-tau-mississippi.gif",
    price: 349,
    spec: { length: "80 cm", scale: "1:120" },
    desc: {
      vi: "Tàu hơi nước bánh guồng kiểu Mỹ, kiến trúc nhiều tầng gợi nhớ sông Mississippi thế kỷ 19.",
      en: "An American paddle-wheel steamer with tiered decks in the style of a 19th-century Mississippi riverboat.",
    },
  },
  {
    slug: "lagoon-450",
    name: "Lagoon 450",
    categories: ["cruise-yachts", "modern-yachts"],
    image: "assets/img/products/lagoon-450-lagoon-450-yacht-model.gif",
    price: 299,
    spec: { length: "72 cm", scale: "1:100" },
    desc: {
      vi: "Du thuyền catamaran hai thân, khoang lái rộng, phù hợp trưng bày tại văn phòng hoặc câu lạc bộ du thuyền.",
      en: "A twin-hull catamaran with a wide helm deck, suited to an office shelf or a yacht-club lobby.",
    },
  },
  {
    slug: "laustral",
    name: "L'Austral",
    categories: ["cruise-yachts"],
    image: "assets/img/products/l-austrl-laustrl-mo-hinh-tau.gif",
    price: 389,
    spec: { length: "85 cm", scale: "1:130" },
    desc: {
      vi: "Tàu du lịch thám hiểm, thân trắng thanh mảnh và ống khói đặc trưng của các chuyến hải trình dài ngày.",
      en: "An expedition cruise ship with a slender white hull and the tall funnel of a long-haul sailing itinerary.",
    },
  },
  {
    slug: "erzherzog-franz-ferdinand",
    name: "Erzherzog Franz Ferdinand",
    categories: ["cruise-yachts"],
    image: "assets/img/products/erzherzog-franz-ferdinand-mo-hinh-tau-erzherzog-franz-ferdinand.gif",
    price: 359,
    spec: { length: "78 cm", scale: "1:120" },
    desc: {
      vi: "Phục dựng tàu khách châu Âu đầu thế kỷ 20, hai ống khói và boong dạo bộ mở.",
      en: "A recreation of an early-1900s European ocean liner, twin funnels and an open promenade deck.",
    },
  },
  {
    slug: "astor",
    name: "Astor",
    categories: ["cruise-yachts"],
    image: "assets/img/products/astor-mo-hinh-tau-astor.gif",
    price: 339,
    spec: { length: "76 cm", scale: "1:120" },
    desc: {
      vi: "Tàu khách viễn dương thân bầu, chi tiết be tàu và cửa sổ tròn xếp đều hai bên mạn.",
      en: "A full-bodied ocean liner with evenly spaced portholes running the length of both flanks.",
    },
  },

  // ---- Cargo Ships ----
  {
    slug: "battersea",
    name: "Battersea",
    categories: ["cargo-ships"],
    image: "assets/img/products/batterses-batterses-mo-hinh-thuyen.gif",
    price: 239,
    spec: { length: "72 cm", scale: "1:150" },
    desc: {
      vi: "Tàu chở hàng nhỏ, cần cẩu bốc dỡ chi tiết ở khoang giữa thân.",
      en: "A small freighter with a detailed midship loading crane, built to hold its own on a desk.",
    },
  },
  {
    slug: "star-1",
    name: "Star 1",
    categories: ["cargo-ships"],
    image: "assets/img/products/star-1-star-1-mo-hinh-thuyen.jpg",
    price: 219,
    spec: { length: "65 cm", scale: "1:150" },
    desc: {
      vi: "Tàu chở hàng đường ngắn, thân sơn hai tông màu và cabin lái đặt lùi về đuôi tàu.",
      en: "A short-haul cargo carrier in a two-tone hull, wheelhouse set well aft.",
    },
  },
  {
    slug: "anteo",
    name: "Anteo",
    categories: ["cargo-ships"],
    image: "assets/img/products/anteo-anteo.jpg",
    price: 249,
    spec: { length: "70 cm", scale: "1:130" },
    desc: {
      vi: "Tàu kéo cứu hộ, thân chắc và cabin cao đặc trưng của đội tàu công vụ cảng biển.",
      en: "A salvage tug with a stout hull and the tall wheelhouse typical of a harbor workboat.",
    },
  },
  {
    slug: "american-scout",
    name: "American Scout",
    categories: ["cargo-ships"],
    image: "assets/img/products/american-sconut-american-sconut.gif",
    price: 265,
    spec: { length: "74 cm", scale: "1:140" },
    desc: {
      vi: "Tàu chở hàng viễn dương, hai cột cẩu và khoang hàng lớn ở giữa thân.",
      en: "An ocean-going freighter with paired cargo derricks flanking a broad midship hold.",
    },
  },

  // ---- Sailing Ships ----
  {
    slug: "wasa",
    name: "Wasa",
    categories: ["sailing-ships"],
    image: "assets/img/products/wasa-mo-hinh-thuyen-buom-2.gif",
    price: 549,
    spec: { length: "95 cm", scale: "1:100" },
    desc: {
      vi: "Phục dựng chiến hạm Thụy Điển Wasa, đuôi tàu chạm khắc và hệ thống buồm ba cột buộc tay từng sợi dây.",
      en: "A replica of the Swedish warship Wasa — a carved stern gallery and a three-mast rig, every line tied by hand.",
    },
  },
  {
    slug: "htv-sailing-ship",
    name: "HTV Sailing Ship",
    categories: ["sailing-ships"],
    image: "assets/img/products/thuyen-buom-htv-mo-hinh-thuyen-buom.gif",
    price: 329,
    spec: { length: "72 cm", scale: "1:90" },
    desc: {
      vi: "Thiết kế thuyền buồm nguyên bản của xưởng Hoa Tay Việt, cân đối giữa chi tiết và giá thành.",
      en: "Hoa Tay Viet's own sailing-ship design, balancing rigging detail against an accessible price.",
    },
  },
  {
    slug: "victory",
    name: "HMS Victory",
    categories: ["sailing-ships"],
    image: "assets/img/products/victory-victory.jpg",
    price: 649,
    spec: { length: "110 cm", scale: "1:100" },
    desc: {
      vi: "Phục dựng kỳ hạm HMS Victory của Đô đốc Nelson, đầy đủ ba cột buồm, cờ hiệu và hai hàng cửa pháo sơn tay.",
      en: "A full recreation of Admiral Nelson's flagship HMS Victory — three masts, signal flags, and two hand-painted gun decks.",
    },
  },
  {
    slug: "thorsen-axel-1810",
    name: "Thorsen Axel 1810",
    categories: ["sailing-ships"],
    image: "assets/img/products/thorsen-axel-1810-na-uy-model-ships-thorsen-axel-1810-na-uy.gif",
    price: 379,
    spec: { length: "82 cm", scale: "1:90" },
    desc: {
      vi: "Thuyền buồm Na Uy đầu thế kỷ 19, thân gỗ sẫm màu và cột buồm cao vút.",
      en: "An early-19th-century Norwegian sailing vessel, dark timber hull under a tall standing rig.",
    },
  },
  {
    slug: "la-jacinthe",
    name: "La Jacinthe",
    categories: ["sailing-ships"],
    image: "assets/img/products/la-jacinthe-thuyen-my-nghe.gif",
    price: 299,
    spec: { length: "68 cm", scale: "1:90" },
    desc: {
      vi: "Thuyền buồm hai cột kiểu Pháp, dáng thon và buồm tam giác gọn nhẹ.",
      en: "A French-style twin-mast schooner, a slim hull carrying a set of lean triangular sails.",
    },
  },
  {
    slug: "christian-radich",
    name: "Christian Radich",
    categories: ["sailing-ships"],
    image: "assets/img/products/christian-radich-christian-radich-model.gif",
    price: 459,
    spec: { length: "92 cm", scale: "1:100" },
    desc: {
      vi: "Phục dựng tàu huấn luyện buồm Na Uy nổi tiếng, ba cột buồm vuông và mạn tàu sơn trắng.",
      en: "A replica of Norway's celebrated training ship, three square-rigged masts above a white-painted hull.",
    },
  },
  {
    slug: "batavia",
    name: "Batavia",
    categories: ["sailing-ships"],
    image: "assets/img/products/batavia-mo-hinh-thuyen-batavia.gif",
    price: 599,
    spec: { length: "105 cm", scale: "1:90" },
    desc: {
      vi: "Phục dựng thuyền buôn Đông Ấn Hà Lan, đuôi tàu chạm trổ công phu và bốn cột buồm rợp dây lèo.",
      en: "A replica Dutch East Indiaman — an ornately carved stern and four masts under a full web of rigging.",
    },
  },
  {
    slug: "ha-long-junk",
    name: "Ha Long Sailing Junk",
    categories: ["sailing-ships"],
    image: "assets/img/products/thuyen-buom-ha-long-mo-hinh-thuyen.jpg",
    price: 259,
    spec: { length: "65 cm", scale: "1:80" },
    desc: {
      vi: "Thuyền buồm Vịnh Hạ Long với buồm nan tre truyền thống, một thiết kế mang đậm bản sắc Việt Nam.",
      en: "A Ha Long Bay junk with traditional bamboo-batten sails — a design rooted in Vietnam's own coastline.",
    },
  },

  // ---- Rowing & Leisure Boats ----
  {
    slug: "xuong",
    name: "Xuong Wooden Skiff",
    categories: ["leisure-boats"],
    image: "assets/img/products/xuong-xuong-go.gif",
    price: 129,
    spec: { length: "48 cm", scale: "1:25" },
    desc: {
      vi: "Xuồng gỗ mộc mạc, dáng thuôn dài như ghe chèo tay miền sông nước.",
      en: "A simple wooden skiff, long and narrow like a hand-paddled river boat.",
    },
  },
  {
    slug: "htv-sailing-ship-mini",
    name: "HTV Sailing Ship — Mini",
    categories: ["leisure-boats"],
    image: "assets/img/products/thuyen-buom-htv-mo-hinh-thuyen-buom-2.gif",
    price: 179,
    spec: { length: "50 cm", scale: "1:130" },
    desc: {
      vi: "Phiên bản nhỏ gọn của thuyền buồm HTV, vừa vặn trên kệ sách hoặc bàn làm việc.",
      en: "A compact version of the HTV sailing ship, sized to sit on a bookshelf or a desk.",
    },
  },

  // ---- Nautical Furniture ----
  {
    slug: "ships-desk",
    name: "Ship's Desk",
    categories: ["furniture"],
    image: "assets/img/products/ban-hoc-sinh-ban-hoc-sinh.gif",
    price: 189,
    spec: { size: "90 × 55 × 75 cm" },
    desc: {
      vi: "Bàn học sinh dáng thân tàu, mặt bàn gỗ liền khối và be tàu cong ở hai bên.",
      en: "A student desk shaped like a ship's hull, a solid wood top framed by curved gunwales.",
    },
  },
  {
    slug: "vanity-table",
    name: "Vanity Table",
    categories: ["furniture"],
    image: "assets/img/products/ban-trang-diem-noi-that-go-tram.gif",
    price: 219,
    spec: { size: "80 × 45 × 140 cm" },
    desc: {
      vi: "Bàn trang điểm gỗ tràm, gương lớn và ngăn kéo chạm khắc hoa văn hàng hải.",
      en: "A blackwood vanity with a tall mirror and drawers carved with a maritime motif.",
    },
  },
  {
    slug: "wooden-wardrobe",
    name: "Wooden Wardrobe",
    categories: ["furniture"],
    image: "assets/img/products/tu-go-tu-go.gif",
    price: 459,
    spec: { size: "120 × 55 × 200 cm" },
    desc: {
      vi: "Tủ áo gỗ hai cánh, bề mặt chạm nổi họa tiết thuyền buồm cỡ lớn.",
      en: "A two-door wardrobe with a large relief carving of a sailing ship across its face.",
    },
  },
  {
    slug: "hull-bar-counter",
    name: "Hull Bar Counter",
    categories: ["furniture"],
    image: "assets/img/products/quay-ba-quay-ba.gif",
    price: 549,
    spec: { size: "180 × 60 × 110 cm" },
    desc: {
      vi: "Quầy bar tạo hình mạn thuyền, mặt quầy gỗ dày phù hợp không gian nhà hàng hải sản hoặc du thuyền.",
      en: "A bar counter shaped from a ship's hull profile, a thick timber top suited to a seafood restaurant or a marina lounge.",
    },
  },
  {
    slug: "boat-shaped-table",
    name: "Boat-Shaped Table",
    categories: ["furniture"],
    image: "assets/img/products/ban-hinh-thuyen-ban-hinh-thuyen.gif",
    price: 279,
    spec: { size: "150 × 60 × 75 cm" },
    desc: {
      vi: "Bàn phòng khách hình thân thuyền, mặt kính hoặc gỗ tùy chọn theo yêu cầu.",
      en: "A living-room table shaped like a boat's hull, glass or timber top available on request.",
    },
  },
  {
    slug: "wooden-table",
    name: "Wooden Table",
    categories: ["furniture"],
    image: "assets/img/products/ban-go-ban-go.gif",
    price: 249,
    spec: { size: "120 × 60 × 75 cm" },
    desc: {
      vi: "Bàn gỗ tự nhiên, chân bàn tiện tay và bề mặt giữ nguyên vân gỗ thật.",
      en: "A solid-wood table with hand-turned legs, the tabletop left to show its natural grain.",
    },
  },

  // ---- Other Handcrafted Pieces ----
  {
    slug: "ships-cannon",
    name: "Ship's Cannon",
    categories: ["other"],
    image: "assets/img/products/cannon-cannon.gif",
    price: 79,
    spec: { size: "30 cm" },
    desc: {
      vi: "Mô hình pháo thuyền cỡ nhỏ, bệ gỗ và bánh xe kim loại chi tiết, thường đi kèm theo cặp.",
      en: "A small-scale ship's cannon on a wood carriage with detailed metal wheels, usually sold in pairs.",
    },
  },
  {
    slug: "ship-relief-panel-1",
    name: "Ship Relief Panel I",
    categories: ["other"],
    image: "assets/img/products/tranh-thuyen-tranh-thuyen-2.gif",
    price: 99,
    spec: { size: "60 × 40 cm" },
    desc: {
      vi: "Tranh gỗ chạm nổi hình thuyền buồm, phù hợp treo phòng làm việc hoặc sảnh đón khách.",
      en: "A carved wood relief panel of a sailing ship, suited to an office wall or a reception hall.",
    },
  },
  {
    slug: "ship-relief-panel-2",
    name: "Ship Relief Panel II",
    categories: ["other"],
    image: "assets/img/products/tranh-thuyen-tranh-thuyen.gif",
    price: 99,
    spec: { size: "60 × 40 cm" },
    desc: {
      vi: "Phiên bản thứ hai của tranh thuyền chạm nổi, bố cục và góc nhìn khác biệt.",
      en: "A second sailing-ship relief panel, a different composition and vantage point from the first.",
    },
  },
  {
    slug: "commemorative-plaque",
    name: "Commemorative Plaque",
    categories: ["other"],
    image: "assets/img/products/ky-niem-chuong-ky-niem-chuong.gif",
    price: 69,
    spec: { size: "25 × 18 cm" },
    desc: {
      vi: "Kỷ niệm chương gỗ khắc theo yêu cầu, thường dùng làm quà tặng đối tác hoặc lưu niệm sự kiện.",
      en: "A carved wood plaque, personalized on request — a common choice for corporate gifts and event keepsakes.",
    },
  },
];

const VND_PER_USD = 25000;

function formatUsd(n) {
  return "$" + n.toLocaleString("en-US");
}

function formatVnd(n) {
  return (n * VND_PER_USD).toLocaleString("vi-VN") + " ₫";
}
