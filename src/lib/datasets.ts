// Pre-configured rich datasets for Data Science & Deep Learning

export interface DatasetColumn {
  name: string;
  type: 'numeric' | 'categorical' | 'boolean';
  description: string;
}

export interface Dataset {
  id: string;
  name: string;
  category: 'Classification' | 'Régression' | 'Déséquilibré' | 'Vision / CNN' | 'Clustering';
  description: string;
  targetColumn: string;
  taskType: 'classification' | 'regression' | 'clustering';
  columns: DatasetColumn[];
  rows: Record<string, any>[];
  hasMissingValues: boolean;
  hasDuplicates: boolean;
  hasOutliers: boolean;
  imbalanceRatio?: string;
}

export const SAMPLE_DATASETS: Dataset[] = [
  {
    id: 'titanic',
    name: 'Titanic : Survie des Passagers',
    category: 'Classification',
    description: 'Le dataset classique pour apprendre le nettoyage : contient des valeurs manquantes (Age, Embarked), des types mixtes et des doublons insérés.',
    targetColumn: 'Survived',
    taskType: 'classification',
    hasMissingValues: true,
    hasDuplicates: true,
    hasOutliers: true,
    columns: [
      { name: 'PassengerId', type: 'numeric', description: 'Identifiant unique' },
      { name: 'Pclass', type: 'numeric', description: 'Classe du billet (1 = 1ère, 2 = 2ème, 3 = 3ème)' },
      { name: 'Sex', type: 'categorical', description: 'Genre (male / female)' },
      { name: 'Age', type: 'numeric', description: 'Âge en années (avec valeurs manquantes)' },
      { name: 'SibSp', type: 'numeric', description: 'Nombre de frères/soeurs/conjoint à bord' },
      { name: 'Fare', type: 'numeric', description: 'Tarif payé pour le voyage (£)' },
      { name: 'Embarked', type: 'categorical', description: 'Port d’embarquement (C = Cherbourg, Q = Queenstown, S = Southampton)' },
      { name: 'Survived', type: 'numeric', description: 'Survie (1 = Oui, 0 = Non)' },
    ],
    rows: [
      { PassengerId: 1, Pclass: 3, Sex: 'male', Age: 22, SibSp: 1, Fare: 7.25, Embarked: 'S', Survived: 0 },
      { PassengerId: 2, Pclass: 1, Sex: 'female', Age: 38, SibSp: 1, Fare: 71.28, Embarked: 'C', Survived: 1 },
      { PassengerId: 3, Pclass: 3, Sex: 'female', Age: 26, SibSp: 0, Fare: 7.925, Embarked: 'S', Survived: 1 },
      { PassengerId: 4, Pclass: 1, Sex: 'female', Age: 35, SibSp: 1, Fare: 53.1, Embarked: 'S', Survived: 1 },
      { PassengerId: 5, Pclass: 3, Sex: 'male', Age: 35, SibSp: 0, Fare: 8.05, Embarked: 'S', Survived: 0 },
      { PassengerId: 6, Pclass: 3, Sex: 'male', Age: null, SibSp: 0, Fare: 8.458, Embarked: 'Q', Survived: 0 }, // Valeur manquante Age
      { PassengerId: 7, Pclass: 1, Sex: 'male', Age: 54, SibSp: 0, Fare: 51.86, Embarked: 'S', Survived: 0 },
      { PassengerId: 8, Pclass: 3, Sex: 'male', Age: 2, SibSp: 3, Fare: 21.075, Embarked: 'S', Survived: 0 },
      { PassengerId: 9, Pclass: 3, Sex: 'female', Age: 27, SibSp: 0, Fare: 11.13, Embarked: 'S', Survived: 1 },
      { PassengerId: 10, Pclass: 2, Sex: 'female', Age: 14, SibSp: 1, Fare: 30.07, Embarked: 'C', Survived: 1 },
      { PassengerId: 11, Pclass: 3, Sex: 'female', Age: 4, SibSp: 1, Fare: 16.7, Embarked: 'S', Survived: 1 },
      { PassengerId: 12, Pclass: 1, Sex: 'female', Age: 58, SibSp: 0, Fare: 26.55, Embarked: 'S', Survived: 1 },
      { PassengerId: 13, Pclass: 3, Sex: 'male', Age: 20, SibSp: 0, Fare: 8.05, Embarked: null, Survived: 0 }, // Valeur manquante Embarked
      { PassengerId: 14, Pclass: 3, Sex: 'male', Age: 39, SibSp: 1, Fare: 31.275, Embarked: 'S', Survived: 0 },
      { PassengerId: 15, Pclass: 3, Sex: 'female', Age: 14, SibSp: 0, Fare: 7.854, Embarked: 'S', Survived: 0 },
      { PassengerId: 16, Pclass: 2, Sex: 'female', Age: 55, SibSp: 0, Fare: 16.0, Embarked: 'S', Survived: 1 },
      { PassengerId: 17, Pclass: 3, Sex: 'male', Age: 2, SibSp: 4, Fare: 29.125, Embarked: 'Q', Survived: 0 },
      { PassengerId: 18, Pclass: 2, Sex: 'male', Age: null, SibSp: 0, Fare: 13.0, Embarked: 'S', Survived: 1 }, // Valeur manquante
      { PassengerId: 19, Pclass: 3, Sex: 'female', Age: 31, SibSp: 1, Fare: 18.0, Embarked: 'S', Survived: 1 },
      { PassengerId: 20, Pclass: 3, Sex: 'female', Age: null, SibSp: 0, Fare: 7.225, Embarked: 'C', Survived: 1 },
      { PassengerId: 21, Pclass: 2, Sex: 'male', Age: 35, SibSp: 0, Fare: 26.0, Embarked: 'S', Survived: 0 },
      { PassengerId: 22, Pclass: 1, Sex: 'female', Age: 38, SibSp: 1, Fare: 512.32, Embarked: 'C', Survived: 1 }, // Outlier Fare 512!
      { PassengerId: 5, Pclass: 3, Sex: 'male', Age: 35, SibSp: 0, Fare: 8.05, Embarked: 'S', Survived: 0 }, // Doublon exact de la ligne 5
      { PassengerId: 9, Pclass: 3, Sex: 'female', Age: 27, SibSp: 0, Fare: 11.13, Embarked: 'S', Survived: 1 }, // Doublon exact
    ]
  },
  {
    id: 'iris',
    name: 'Iris de Fisher (Clustering & Multi-classes)',
    category: 'Clustering',
    description: '3 espèces de fleurs iris (Setosa, Versicolor, Virginica) avec 4 mesures biométriques. Idéal pour K-Means, PCA et frontière non-linéaire.',
    targetColumn: 'Species',
    taskType: 'clustering',
    hasMissingValues: false,
    hasDuplicates: false,
    hasOutliers: false,
    columns: [
      { name: 'SepalLength', type: 'numeric', description: 'Longueur sépale (cm)' },
      { name: 'SepalWidth', type: 'numeric', description: 'Largeur sépale (cm)' },
      { name: 'PetalLength', type: 'numeric', description: 'Longueur pétale (cm)' },
      { name: 'PetalWidth', type: 'numeric', description: 'Largeur pétale (cm)' },
      { name: 'Species', type: 'categorical', description: 'Espèce (setosa / versicolor / virginica)' },
    ],
    rows: [
      { SepalLength: 5.1, SepalWidth: 3.5, PetalLength: 1.4, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 4.9, SepalWidth: 3.0, PetalLength: 1.4, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 4.7, SepalWidth: 3.2, PetalLength: 1.3, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 4.6, SepalWidth: 3.1, PetalLength: 1.5, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 5.0, SepalWidth: 3.6, PetalLength: 1.4, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 5.4, SepalWidth: 3.9, PetalLength: 1.7, PetalWidth: 0.4, Species: 'setosa' },
      { SepalLength: 7.0, SepalWidth: 3.2, PetalLength: 4.7, PetalWidth: 1.4, Species: 'versicolor' },
      { SepalLength: 6.4, SepalWidth: 3.2, PetalLength: 4.5, PetalWidth: 1.5, Species: 'versicolor' },
      { SepalLength: 6.9, SepalWidth: 3.1, PetalLength: 4.9, PetalWidth: 1.5, Species: 'versicolor' },
      { SepalLength: 5.5, SepalWidth: 2.3, PetalLength: 4.0, PetalWidth: 1.3, Species: 'versicolor' },
      { SepalLength: 6.5, SepalWidth: 2.8, PetalLength: 4.6, PetalWidth: 1.5, Species: 'versicolor' },
      { SepalLength: 5.7, SepalWidth: 2.8, PetalLength: 4.5, PetalWidth: 1.3, Species: 'versicolor' },
      { SepalLength: 6.3, SepalWidth: 3.3, PetalLength: 6.0, PetalWidth: 2.5, Species: 'virginica' },
      { SepalLength: 5.8, SepalWidth: 2.7, PetalLength: 5.1, PetalWidth: 1.9, Species: 'virginica' },
      { SepalLength: 7.1, SepalWidth: 3.0, PetalLength: 5.9, PetalWidth: 2.1, Species: 'virginica' },
      { SepalLength: 6.3, SepalWidth: 2.9, PetalLength: 5.6, PetalWidth: 1.8, Species: 'virginica' },
      { SepalLength: 6.5, SepalWidth: 3.0, PetalLength: 5.8, PetalWidth: 2.2, Species: 'virginica' },
      { SepalLength: 7.6, SepalWidth: 3.0, PetalLength: 6.6, PetalWidth: 2.1, Species: 'virginica' },
    ]
  },
  {
    id: 'housing',
    name: 'Immobilier : Prédiction de Prix (Régression)',
    category: 'Régression',
    description: 'Caractéristiques de logements (surface, chambres, revenu du quartier, distance centre) pour prédire le prix de vente en k€.',
    targetColumn: 'Price_kEuros',
    taskType: 'regression',
    hasMissingValues: false,
    hasDuplicates: false,
    hasOutliers: true,
    columns: [
      { name: 'Surface_m2', type: 'numeric', description: 'Surface habitable en mètres carrés' },
      { name: 'Rooms', type: 'numeric', description: 'Nombre de pièces' },
      { name: 'Income_k', type: 'numeric', description: 'Revenu moyen du quartier en k€' },
      { name: 'Dist_Center_km', type: 'numeric', description: 'Distance au centre-ville (km)' },
      { name: 'Price_kEuros', type: 'numeric', description: 'Prix estimé du logement (k€)' },
    ],
    rows: [
      { Surface_m2: 35, Rooms: 1, Income_k: 28, Dist_Center_km: 2.1, Price_kEuros: 165 },
      { Surface_m2: 45, Rooms: 2, Income_k: 32, Dist_Center_km: 3.4, Price_kEuros: 198 },
      { Surface_m2: 60, Rooms: 3, Income_k: 40, Dist_Center_km: 4.8, Price_kEuros: 245 },
      { Surface_m2: 75, Rooms: 3, Income_k: 48, Dist_Center_km: 5.2, Price_kEuros: 289 },
      { Surface_m2: 90, Rooms: 4, Income_k: 55, Dist_Center_km: 6.0, Price_kEuros: 340 },
      { Surface_m2: 110, Rooms: 5, Income_k: 68, Dist_Center_km: 7.5, Price_kEuros: 410 },
      { Surface_m2: 130, Rooms: 5, Income_k: 75, Dist_Center_km: 8.2, Price_kEuros: 475 },
      { Surface_m2: 150, Rooms: 6, Income_k: 92, Dist_Center_km: 9.0, Price_kEuros: 540 },
      { Surface_m2: 180, Rooms: 7, Income_k: 110, Dist_Center_km: 11.5, Price_kEuros: 630 },
      { Surface_m2: 250, Rooms: 9, Income_k: 180, Dist_Center_km: 1.5, Price_kEuros: 1450 }, // Outlier luxe
    ]
  },
  {
    id: 'churn',
    name: 'Télécom : Désabonnement Client (Déséquilibré)',
    category: 'Déséquilibré',
    description: 'Dataset hautement déséquilibré (83% fidèles, 17% churn). Idéal pour comprendre pourquoi l’accuracy ment et comment SMOTE équilibre les données.',
    targetColumn: 'Churn',
    taskType: 'classification',
    hasMissingValues: false,
    hasDuplicates: false,
    hasOutliers: false,
    imbalanceRatio: '83% Fidèles / 17% Churn',
    columns: [
      { name: 'Tenure_Months', type: 'numeric', description: 'Ancienneté du client en mois' },
      { name: 'MonthlyCharge', type: 'numeric', description: 'Facturation mensuelle (€)' },
      { name: 'ContractType', type: 'categorical', description: 'Type d’engagement (Month-to-month, 1-Year, 2-Year)' },
      { name: 'TechSupport', type: 'categorical', description: 'Option support technique (Yes / No)' },
      { name: 'Churn', type: 'numeric', description: 'Désabonnement (1 = A résilié, 0 = Resté fidèle)' },
    ],
    rows: [
      { Tenure_Months: 2, MonthlyCharge: 79.5, ContractType: 'Month-to-month', TechSupport: 'No', Churn: 1 },
      { Tenure_Months: 48, MonthlyCharge: 45.2, ContractType: '2-Year', TechSupport: 'Yes', Churn: 0 },
      { Tenure_Months: 36, MonthlyCharge: 62.0, ContractType: '1-Year', TechSupport: 'Yes', Churn: 0 },
      { Tenure_Months: 1, MonthlyCharge: 89.0, ContractType: 'Month-to-month', TechSupport: 'No', Churn: 1 },
      { Tenure_Months: 60, MonthlyCharge: 24.5, ContractType: '2-Year', TechSupport: 'No', Churn: 0 },
      { Tenure_Months: 24, MonthlyCharge: 55.0, ContractType: '1-Year', TechSupport: 'Yes', Churn: 0 },
      { Tenure_Months: 18, MonthlyCharge: 68.4, ContractType: 'Month-to-month', TechSupport: 'No', Churn: 0 },
      { Tenure_Months: 72, MonthlyCharge: 95.0, ContractType: '2-Year', TechSupport: 'Yes', Churn: 0 },
      { Tenure_Months: 5, MonthlyCharge: 70.1, ContractType: 'Month-to-month', TechSupport: 'No', Churn: 1 },
      { Tenure_Months: 30, MonthlyCharge: 49.9, ContractType: '1-Year', TechSupport: 'Yes', Churn: 0 },
      { Tenure_Months: 42, MonthlyCharge: 52.3, ContractType: '2-Year', TechSupport: 'Yes', Churn: 0 },
      { Tenure_Months: 12, MonthlyCharge: 64.0, ContractType: 'Month-to-month', TechSupport: 'No', Churn: 0 },
      { Tenure_Months: 65, MonthlyCharge: 39.8, ContractType: '2-Year', TechSupport: 'Yes', Churn: 0 },
      { Tenure_Months: 8, MonthlyCharge: 82.5, ContractType: 'Month-to-month', TechSupport: 'No', Churn: 0 },
      { Tenure_Months: 55, MonthlyCharge: 58.2, ContractType: '2-Year', TechSupport: 'Yes', Churn: 0 },
    ]
  }
];
