export type Project = {
  slug: string;
  title: string;
  desc: string;           // short card blurb
  year?: string;
  tech: string[];
  problem?: string;
  approach?: string[];
  outcomes?: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "face-verification-metric-vs-supervised",
    title: "Face Verification — Metric vs Supervised Learning",
    desc: "Compared metric learning and supervised classification pipelines for facial verification; deployed embedding-based model with real-time webcam inference.",
    year: "2025",
    tech: [
      "TensorFlow", "Keras", "FaceNet", "EfficientNetV2B0",
      "Metric Learning", "Triplet Loss", "Adam", "AdamW",
      "OpenCV", "DeepFace", "Python"
    ],
    problem: "Determine whether metric learning or supervised classification is more effective for face verification, and deploy the optimal model for real-time use.",
    approach: [
      "Dataset: loaded Kaggle competition dataset; split into train/val/test; resized to 160×160.",
      "Metric learning: custom CNN backbone producing 128-dim L2-normalised embeddings; trained with triplet loss; tuned batch size, learning rate, and epochs.",
      "Supervised learning: EfficientNetV2B0 backbone + GAP + dense softmax head; AdamW optimiser, early stopping, and LR reduction on plateau.",
      "Evaluation: ROC curves, AUC scores, confusion matrix for supervised model; embedding distance threshold tuning for metric learning.",
      "Deployment: integrated best embedding model into OpenCV webcam loop; added live capture and naming system; emotion & anti-spoofing via DeepFace."
    ],
    outcomes: [
      "Metric learning model achieved >0.97 AUC on verification task with tuned threshold.",
      "Supervised EfficientNetV2B0 reached >94% classification accuracy.",
      "Deployed metric learning model; successfully recognised enrolled users in live tests."
    ],
    links: [
      { label: "GitHub", href: "https://github.com/matthew-dumicich/face-classification" },
    ]
  },

  {
    slug: "healthcare-access-anomaly-detection",
    title: "Healthcare Access Anomaly Detection",
    desc: "Group industry application of ML-driven detection of suspicious user access patterns in clinical systems with explainable outputs.",
    year: "2025",
    tech: [
      "Python", "Pandas", "NumPy", "Scikit-learn",
      "One-Class SVM", "Isolation Forest",
      "Multi-class Anomaly Detection",
    ],
    problem: "Identify anomalous access to sensitive healthcare records while minimising false positives and enabling human validation.",
    approach: [
      "Ingested and preprocessed access logs (user ID, timestamp, location, role, patient ID).",
      "Trained unsupervised models (One-Class SVM, Isolation Forest) on historical ‘normal’ behaviour.",
      "Built web app for human-in-the-loop review, displaying flagged sessions with contextual peer behaviour.",
      "Explainability: Used multi-class anomaly detection to show why an access was flagged."
    ],
    outcomes: [
      "Reduced false positive alerts compared to rules-based baseline.",
      "Provided explainable anomaly scores and exemplar comparisons, increasing analyst trust in model outputs."
    ]
  },

  {
    slug: "animal-and-plant-classifier-efficientnet",
    title: "Animal and Plant Classifier",
    desc: "Transfer-learning pipelines (VGG16, EfficientNetB0/V2S/V2L) for 10-class animal/plant recognition in TensorFlow.",
    year: "2025",
    tech: ["TensorFlow", "Keras", "EfficientNetV2", "EfficientNetB0", "VGG16", "Adam", "AdamW", "CNN", "Python"],
    problem: "Build a robust 10-class image classifier for mixed animal and plant categories from foldered images.",
    approach: [
      "Data prep: folder split with splitfolders (70/15/15 train/val/test), tf.keras.image_dataset_from_directory, BATCH=32.",
      "Preprocessing: images at 480×480 then resized to 224×224 in-graph; light aug (RandomFlip, RandomRotation).",
      "EfficientNet variants: frozen backbones with GAP + dense head — B0, V2S, and V2L; added Dropout in later runs.",
      "Optimisation: Adam; later AdamW with EarlyStopping + ReduceLROnPlateau.",
      "Evaluation: top-1 accuracy on held-out test set + per-class accuracy from confusion matrix; training curves logged."
    ],
    outcomes: [
      "Best: EfficientNetV2L + Dropout + AdamW + callbacks — 92.13% top-1; ~0.921 macro per-class accuracy.",
      "100% grade (HD) for assignment; top 10% of kaggle leaderboard.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/matthew-dumicich/plant-and-animal-classifier" }
    ]
  },

  {
    slug: "golf-game-ruby",
    title: "Golf Game — Functional Golf (Ruby + Gosu)",
    desc: "Tile-based golf with deterministic physics, sounds, and level loader.",
    year: "2024",
    tech: ["Ruby", "Gosu", "Functional Programming", "GUI", "Documentation"],
    problem: "Model golf mechanics and surfaces with pure functions; keep rendering/IO at the edges.",
    approach: [
      "Immutable State struct + reducer(step): state → state; inputs/events are pure.",
      "Tile system from external files (levels.txt, tile_traits.txt); surfaces change bounce/roll physics.",
      "Configurable surface physics allowing custom bounce and roll profiles per tile type.",
      "Resolution-aware rendering; Wind and obstacle effects parameterised for easy level designer tuning."
    ],
    outcomes: [
      "Level designers can create and test new maps without modifying code.",
      "End to end game experience with configurable physics and levels."
    ],
    links: [{ label: "Demo", href: "https://youtu.be/9Lm2OIM9xtI" }, { label: "Repo", href: "https://github.com/matthew-dumicich/golf-game" }]
  }
];
