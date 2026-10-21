# 🧠 NeuroLearn Studio — Plateforme Éducative Deep Learning & Machine Learning

Une application web moderne, interactive et immersive conçue pour la présentation et l'apprentissage approfondi du module **Deep Learning & Machine Learning**. Développée avec **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** et **Three.js**, selon les standards de design `/ui-ux-pro-max`.

---

## 🚀 Lancement Rapide

Pour lancer le serveur de développement en local :

```bash
npm run dev
```

L'application sera accessible immédiatement sur : **[http://localhost:3000](http://localhost:3000)**

Pour construire la version de production optimisée :

```bash
npm run build
npm run start
```

---

## 🌟 Modules & Fonctionnalités Clés

### 1. 🧹 Data Studio & Pipeline de Nettoyage Automatique (`/data-cleaning`)
* **Chargement de Données** : 4 datasets riches intégrés (*Titanic*, *Iris*, *Housing/Immobilier*, *Télécom Churn Déséquilibré*) + bouton d'import de vos propres fichiers **CSV**.
* **Diagnostic & Profiling Instantané** : Détection automatique des types, comptage des valeurs manquantes (`NaN`), détection des doublons exacts et repérage des valeurs aberrantes (*Outliers via l'IQR*).
* **Nettoyage Interactif en 1 Clic** :
  * Dédoublonnage instantané avec calcul des lignes sauvées.
  * Imputation personnalisée : Médiane (recommandée avec outliers), Moyenne, Mode (variables catégorielles), Zéro ou suppression de lignes.
* **Feature Scaling & Prétraitement** :
  * **Normalisation Min-Max** : $x' = \frac{x - x_{\min}}{x_{\max} - x_{\min}} \in [0, 1]$.
  * **Standardisation Z-Score** : $z = \frac{x - \mu}{\sigma} \sim \mathcal{N}(0, 1)$.
  * **RobustScaler** : Résistant aux valeurs aberrantes grâce à la médiane et l'IQR.
  * **Lissage (Smoothing)** : Moyenne mobile temporelle pour atténuer le bruit.
* **Techniques d'Équilibrage des Données (Imbalanced Data)** :
  * Explication visuelle du **piège de l'Accuracy** sur classes rares.
  * Algorithme **SMOTE** (*Synthetic Minority Over-sampling Technique*) : synthèse de nouveaux points par interpolation le long des segments entre voisins k-NN.
  * Export direct du dataset nettoyé au format CSV.

---

### 2. ⚡ Algorithmes Machine Learning 2D/3D (`/machine-learning`)
* **Classification Interactive (Canvas 2D)** :
  * Cliquez directement sur le canvas pour ajouter vos propres points de données.
  * Testez et comparez en direct : **Régression Logistique**, **K-Plus Proches Voisins (k-NN)** avec slider de $k$, **Arbres de Décision (splits orthogonaux)** et **SVM (Support Vector Machines)**.
* **Régression & Compromis Biais-Variance** :
  * Régression Linéaire ($y = wx + b$) et Polynomiale (Degré 1 à 5).
  * Visualisation en direct du **Sous-apprentissage (Underfitting)** vs **Surapprentissage (Overfitting)**.
  * Régularisation **Ridge ($L_2$)** vs **Lasso ($L_1$)** avec slider de pénalité $\lambda$.
* **Clustering Non-Supervisé (K-Means)** :
  * Animation pas-à-pas : Initialisation des centroïdes ➔ Assignation Voronoï ➔ Mise à jour barycentrique.
  * **Méthode du Coude (Elbow Method)** et calcul de l'inertie WCSS.

---

### 3. 🎯 Métriques d'Évaluation & Stratégies de Validation (`/evaluation`)
* **Matrice de Confusion Interactive** :
  * Curseurs de seuil de décision $\theta \in [0.1, 0.9]$.
  * Recalcul instantané : Vrais Positifs (TP), Faux Positifs (FP - Erreur Type I), Faux Négatifs (FN - Erreur Type II), Vrais Négatifs (TN).
  * Formules exactes : Accuracy, Précision, Rappel (Recall/Sensibilité), F1-Score harmonique et Spécificité.
  * Tracé dynamique de la **Courbe ROC (Receiver Operating Characteristic)** et calcul de l'AUC.
* **Métriques de Régression** : MAE, MSE, RMSE, $R^2$ décryptées avec rigueur.
* **Validation Croisée (K-Fold Cross-Validation)** : Démonstration animée sur 5 plis.
* **Alerte Fuite de Données (Data Leakage)** : Pourquoi et comment isoler strictement le train set avant tout scaling.

---

### 4. 🧠 Deep Learning : Cerveau Humain vs Réseau Artificiel (`/deep-learning`)
* **Modèle 3D Interactif Three.js** :
  * Visualisation spatiale des couches neuronales et des synapses avec potentiels d'action en circulation.
  * Pivotable à 360° à la souris.
  * Comparateur anatomique : Dendrites ⟷ Entrées $x_i$, Synapse ⟷ Poids $w_i$, Soma ⟷ Somme $\sum$, Décharge ⟷ Fonction d'Activation $f(z)$.
* **Simulateur des Fonctions d'Activation** :
  * Analyse de 8 fonctions : ReLU, Sigmoïde, Tanh, Leaky ReLU, GELU, etc.
  * Tracé simultané de $f(x)$ et du **gradient rétropropagé $f'(x)$**.
  * Détection en direct des pathologies : **Vanishing Gradient** (disparition du gradient) et **Dying ReLU** (neurones morts bloqués à 0).
  * Guide prescriptif : *Où l'utiliser et où NE JAMAIS l'utiliser*.

---

### 5. 👁️ Réseaux Convolutifs (CNN) From Scratch en 3D (`/cnn-from-scratch`)
* **Pourquoi les MLP échouent sur les images** : Explosion des dimensions et destruction de l'information spatiale 2D.
* **Visualisateur 3D de Tenseurs** :
  * Volumes spatiaux flottants : Image d'entrée ➔ Kernel de convolution ➔ Feature Maps ➔ Max-Pooling ➔ Vecteur 1D Flatten ➔ Couche Dense Softmax.
* **Inspecteur Déterministe 2D (From Scratch)** :
  * Glissement du filtre pas-à-pas (Sobel horizontal, Sobel vertical, Laplacien, Flou gaussien).
  * Calcul en direct du produit scalaire point par point et application de ReLU.
  * Formule mathématique universelle de la dimension de sortie avec Kernel, Padding et Stride.

---

### 6. 🎮 L'Arène des Jeux & Quiz Certifiant (`/playground`)
* **Mini-Jeu #1 : L'Œil de la Convolution** : Trouvez le bon filtre Sobel pour isoler un obstacle routier.
* **Quiz Interactif Certifiant** : 5 questions approfondies avec double niveau d'explication et pluie de confettis en cas de réussite.
* **Système de Gamification** : Compteur d'XP en temps réel et hauts-faits déblocables au fur et à mesure de l'exploration.

---

### 💡 Double Mode d'Explication (En 1 Clic dans la Barre de Navigation)
* **Mode Vulgarisé (Débutant)** : Des métaphores simples issues du quotidien pour chaque terme technique.
* **Mode Ingénieur (From Scratch)** : Les équations mathématiques complètes, dérivées, matrices et pseudo-code.
