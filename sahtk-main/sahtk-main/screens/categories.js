export const testCategories = [
  { key: 'heart', name: 'Heart', icon: require('../assets/heart.png') },
  { key: 'diabetes', name: 'Diabetes', icon: require('../assets/diabetes.png') },
  { key: 'vitamin', name: 'Vitamin', icon: require('../assets/vitamin.png') },
  { key: 'kidney', name: 'Kidney', icon: require('../assets/kidney.png') },
  { key: 'infection', name: 'Infection', icon: require('../assets/infection.png') },
  { key: 'liver', name: 'Liver', icon: require('../assets/liver.png') },
  { key: 'hormones', name: 'Hormones', icon: require('../assets/hormones.png') },
  { key: 'blood', name: 'Blood Group', icon: require('../assets/blood group.png') },
  { key: 'basic', name: 'Basic Tests', icon: require('../assets/basic tests .png') },
];


export const categoryTests = {
  heart: [
    {
      name: 'Heart Check Complete',
      desc: 'ECG, CRP, Lipid profile, Troponin',
      price: '60 TND',
    },
    {
      name: 'Lipid Profile',
      desc: 'Cholesterol, HDL, LDL, Triglycerides',
      price: '35 TND',
    },
    {
      name: 'Cardiac Enzymes',
      desc: 'CK-MB, Troponin I, Troponin T',
      price: '50 TND',
    },
  ],
  diabetes: [
    {
      name: 'Diabetes Package',
      desc: 'HbA1c, Glucose, Insulin level',
      price: '35 TND',
    },
    {
      name: 'HbA1c Test',
      desc: 'Glycated hemoglobin measurement',
      price: '25 TND',
    },
    {
      name: 'Glucose Tolerance Test',
      desc: 'OGTT with glucose load',
      price: '40 TND',
    },
  ],
  vitamin: [
    {
      name: 'Vitamin D Test',
      desc: '25-hydroxyvitamin D measurement',
      price: '30 TND',
    },
    {
      name: 'Vitamin B12 Test',
      desc: 'Cobalamin (B12) blood level',
      price: '28 TND',
    },
    {
      name: 'Vitamin Profile',
      desc: 'D, B12, B9, E, A, C',
      price: '50 TND',
    },
  ],
  kidney: [
    {
      name: 'Kidney Function Panel',
      desc: 'Creatinine, Urea, Uric acid',
      price: '32 TND',
    },
    {
      name: 'Urinalysis',
      desc: 'Urine test for kidney health',
      price: '18 TND',
    },
    {
      name: 'Microalbuminuria',
      desc: 'Early kidney damage screening',
      price: '22 TND',
    },
  ],
  infection: [
    {
      name: 'CRP Test',
      desc: 'C-reactive protein for inflammation',
      price: '20 TND',
    },
    {
      name: 'Widal Test',
      desc: 'Typhoid fever screening',
      price: '25 TND',
    },
    {
      name: 'Hepatitis B Screening',
      desc: 'HBsAg, Anti-HBs, Anti-HBc',
      price: '40 TND',
    },
  ],
  liver: [
    {
      name: 'Liver Function Panel',
      desc: 'ALT, AST, ALP, Bilirubin, Albumin',
      price: '38 TND',
    },
    {
      name: 'Bilirubin Test',
      desc: 'Total and direct bilirubin',
      price: '18 TND',
    },
    {
      name: 'Hepatitis C Screening',
      desc: 'Anti-HCV antibody',
      price: '35 TND',
    },
  ],
  hormones: [
    {
      name: 'Thyroid Panel',
      desc: 'TSH, T3, T4',
      price: '36 TND',
    },
    {
      name: 'Cortisol Test',
      desc: 'Morning cortisol level',
      price: '28 TND',
    },
    {
      name: 'FSH/LH/Prolactin Panel',
      desc: 'Female hormone profile',
      price: '45 TND',
    },
  ],
  blood: [
    {
      name: 'Blood Grouping',
      desc: 'ABO and Rh typing',
      price: '15 TND',
    },
    {
      name: 'Crossmatch',
      desc: 'Compatibility testing',
      price: '22 TND',
    },
    {
      name: 'Direct Coombs Test',
      desc: 'Autoimmune hemolysis screening',
      price: '20 TND',
    },
  ],
  basic: [
    {
      name: 'CBC (Complete Blood Count)',
      desc: 'RBC, WBC, Platelets, Hemoglobin',
      price: '18 TND',
    },
    {
      name: 'ESR',
      desc: 'Erythrocyte sedimentation rate',
      price: '10 TND',
    },
    {
      name: 'Blood Sugar (Fasting)',
      desc: 'Glucose level after fasting',
      price: '12 TND',
    },
  ],
};
