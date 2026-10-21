export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanationBeginner: string;
  explanationAdvanced: string;
}

export const ML_DL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    category: 'Prétraitement & Nettoyage',
    question: 'Pourquoi l’imputation par la moyenne sur une variable contenant des valeurs aberrantes extrêmes (outliers) est-elle une mauvaise pratique ?',
    options: [
      'Parce que la moyenne est très sensible aux valeurs extrêmes et va biaiser toutes les données imputées.',
      'Parce que l’imputation par la moyenne ne fonctionne que sur les variables catégorielles.',
      'Parce que cela supprime automatiquement les colonnes.',
      'Parce que la moyenne augmente toujours la variance par 10.'
    ],
    correctIndex: 0,
    explanationBeginner: 'Imaginez que vous calculiez le salaire moyen dans un café où entre soudainement Elon Musk : la moyenne bondit à plusieurs millions ! Remplacer les valeurs manquantes par ce chiffre fausserait tout. Dans ce cas, la médiane est bien plus stable.',
    explanationAdvanced: 'La moyenne arithmétique a un point de rupture de 0% (un seul point à l’infini fait diverger la moyenne). La médiane a un point de rupture de 50%. En présence d’asymétrie (skewness) ou d’outliers, on privilégie la médiane ou un RobustScaler / Winsorisation.'
  },
  {
    id: 2,
    category: 'Équilibrage des Données',
    question: 'Dans un dataset de détection de fraudes où 99% des transactions sont légitimes et 1% sont frauduleuses, un modèle affiche 99% d’Accuracy. Que signifie ce résultat ?',
    options: [
      'Le modèle est excellent et prêt pour la production.',
      'Le résultat est trompeur : un modèle prédisant toujours "Légitime" obtiendrait 99% sans détecter la moindre fraude.',
      'L’Accuracy est la seule métrique fiable en cas de déséquilibre de classe.',
      'Le modèle a sur-appris la classe minoritaire.'
    ],
    correctIndex: 1,
    explanationBeginner: 'C’est le "Paradoxe de l’Accuracy". Si un médecin dit à tout le monde "vous n’avez pas cette maladie ultra-rare", il a raison 99% du temps, mais il ne soigne personne ! On doit regarder le Rappel (Recall) et le F1-Score.',
    explanationAdvanced: 'L’Accuracy est sensible au déséquilibre de classe prior $P(y)$. Il faut analyser la matrice de confusion, le Recall $\\frac{TP}{TP+FN}$, la Précision $\\frac{TP}{TP+FP}$, le score F1 harmonique ou l’AUC-PR, et appliquer SMOTE ou des poids de classes (class_weight="balanced").'
  },
  {
    id: 3,
    category: 'Deep Learning & Fonctions d’Activation',
    question: 'Quel problème majeur a conduit à abandonner la fonction Sigmoïde dans les couches cachées des réseaux profonds au profit de ReLU ?',
    options: [
      'La disparition du gradient (Vanishing Gradient) : la dérivée de la sigmoïde sature à 0 pour les fortes valeurs.',
      'La sigmoïde ne peut pas gérer les nombres négatifs.',
      'La sigmoïde provoque une explosion de la mémoire GPU.',
      'La sigmoïde est discontinue en 0.'
    ],
    correctIndex: 0,
    explanationBeginner: 'Quand un réseau a beaucoup de couches, le signal de correction (gradient) est multiplié à chaque couche. La dérivée de la sigmoïde est au maximum de 0.25 : à force de multiplier par 0.25, le signal devient minuscule (0.25^10 ≈ 0.00000095) et les premières couches n’apprennent plus rien.',
    explanationAdvanced: '$\\sigma\'(z) = \\sigma(z)(1 - \\sigma(z)) \\le 0.25$. Par la règle de dérivation en chaîne (Chain Rule), le gradient rétropropagé tend exponentiellement vers zéro avec la profondeur $L$. ReLU ($f(x) = \\max(0, x)$) a une dérivée de 1 pour tout $x > 0$, maintenant un flux de gradient constant.'
  },
  {
    id: 4,
    category: 'Vision par Ordinateur & CNN',
    question: 'Quelle est la fonction principale d’une couche de Max-Pooling (2x2) dans un Réseau de Neurones Convolutif ?',
    options: [
      'Augmenter la résolution de l’image pour voir plus de détails.',
      'Réduire la dimension spatiale, le nombre de paramètres et apporter une invariance aux petites translations.',
      'Multiplier les pixels par des poids aléatoires.',
      'Remplacer les couches denses par des filtres de Sobel.'
    ],
    correctIndex: 1,
    explanationBeginner: 'Le Max-Pooling garde uniquement le pixel le plus intense dans un carré de 2x2. C’est comme plisser les yeux pour résumer l’information essentielle : la taille de l’image est divisée par 2, ce qui accélère le calcul et rend le réseau insensible aux légers décalages.',
    explanationAdvanced: 'Le Max-Pooling divise la hauteur et la largeur par le facteur de pooling (ex: $H/2, W/2$). Cela réduit de 75% le nombre d’activations spatiales, contrôle le risque de surapprentissage (overfitting) et confère une invariance locale par translation : la détection d’un contour reste active même si l’objet bouge de 1 pixel.'
  },
  {
    id: 5,
    category: 'Régularisation ML',
    question: 'Quelle est la différence fondamentale entre la régularisation Ridge (L2) et Lasso (L1) ?',
    options: [
      'Ridge annule complètement certains coefficients (sélection de variables), tandis que Lasso les réduit tous.',
      'Lasso peut annuler exactement des coefficients (effectuant ainsi une sélection automatique de variables), tandis que Ridge les rapproche de zéro sans jamais les annuler complètement.',
      'Ridge s’applique uniquement aux réseaux de neurones, Lasso aux arbres.',
      'Il n’y a aucune différence mathématique.'
    ],
    correctIndex: 1,
    explanationBeginner: 'Lasso est comme un tri sélectif strict : si une variable est inutile, il met son importance exactement à zéro. Ridge est plus doux : il réduit l’importance de tout le monde sans jamais jeter personne à la poubelle.',
    explanationAdvanced: 'La pénalité L1 $|w|$ a des points anguleux sur les axes (boule de norme L1 en forme de diamant). L’intersection de la fonction de coût avec cette boule se produit souvent sur les axes, fixant $w_i = 0$ (sparse weights). La boule L2 $\\sum w_i^2$ est une sphère lisse, donc les coefficients diminuent continûment sans atteindre strictement zéro.'
  }
];
