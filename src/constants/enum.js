const SEX = Object.freeze([
  { value: 'WOMAN', label: '여성' },
  { value: 'MAN', label: '남성' },
]);
const INDUSTRY = Object.freeze([
  { value: 'FOOD_DINING', label: '외식/음식점', icon: '🍚' },
  { value: 'CAFE_DESSERT', label: '카페/디저트', icon: '☕️' },
  { value: 'PUB_BAR', label: '주점', icon: '🍺' },
  { value: 'CONVENIENCE_RETAIL', label: '편의점/소매', icon: '🏪' },
  { value: 'GROCERY_MART', label: '마트/식료품', icon: '🥩' },
  { value: 'BEAUTY_CARE', label: '뷰티/미용', icon: '💈' },
  { value: 'HEALTH_FITNESS', label: '건강', icon: '💪🏻' },
  { value: 'FASHION_GOODS', label: '패션/잡화', icon: '👚' },
  { value: 'HOME_LIVING_INTERIOR', label: '생활용품/가구', icon: '🛋️' },
  { value: 'HOBBY_LEISURE', label: '취미/오락/여가', icon: '🕹️' },
  { value: 'CULTURE_BOOKS', label: '문화/서적', icon: '📚' },
  { value: 'PET', label: '반려동물', icon: '🐶' },
  { value: 'LODGING', label: '숙박', icon: '🏨' },
  { value: 'EDUCATION_ACADEMY', label: '교육/학원', icon: '✏️' },
  { value: 'AUTO_TRANSPORT', label: '자동차/운송', icon: '🚘' },
  { value: 'IT_OFFICE', label: 'IT/사무', icon: '🖥️' },
  { value: 'FINANCE_LEGAL_TAX', label: '금융/법률/회계', icon: '⚖️' },
  { value: 'MEDICAL_PHARMA', label: '의료/의약', icon: '💊' },
  { value: 'PERSONAL_SERVICES', label: '생활 서비스', icon: '🧹' },
  { value: 'FUNERAL_WEDDING', label: '장례/예식', icon: '🪦' },
  { value: 'PHOTO_STUDIO', label: '사진/스튜디오', icon: '📷' },
  { value: 'OTHER_RETAIL', label: '기타 판매업', icon: '…' },
  { value: 'OTHER_SERVICE', label: '기타 서비스업', icon: '…' },
]);
const FOUNDER_TARGET = Object.freeze([
  { value: 'LOCAL', label: '동네주민' },
  { value: 'STRANGER', label: '외부인' },
]);
const BANK_CATEGORY = Object.freeze([
  { value: 'NATURAL', label: '개인' },
  { value: 'LEGAL', label: '법인' },
]);
const REWARD_AMOUNT = Object.freeze([
  { value: 5000, label: `${(5000).toLocaleString('ko-KR')}원` },
  { value: 10000, label: `${(10000).toLocaleString('ko-KR')}원` },
  { value: 30000, label: `${(30000).toLocaleString('ko-KR')}원` },
  { value: 50000, label: `${(50000).toLocaleString('ko-KR')}원` },
]);

export { SEX, INDUSTRY, FOUNDER_TARGET, BANK_CATEGORY, REWARD_AMOUNT };
