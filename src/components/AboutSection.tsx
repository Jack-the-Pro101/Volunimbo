import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section class={styles.about}>
      <h2>About</h2>

      <p>
        A cloud classifier powered by a convolutional neural network model that runs locally in-browser. All 3 models
        share a CNN that was trained on the genera classification datasets, with the supplementary features/varieties
        models being made by transfer-learning on the common CNN.
      </p>

      <p>
        Data used to train the model is from the following (This project was developed as my ICS4U final project and is
        made for educational purposes, please don't sue me):
      </p>

      <p>Shared CNN and genera classifier:</p>
      <ul>
        <li>
          <a
            href="https://github.com/SadaharuZL/HuaYun-BJUT-MIP-Cloud-Dataset"
            target="_blank"
            rel="noopener noreferrer"
          >
            HuaYun-BJUT-MIP-Cloud-Dataset
          </a>
        </li>
        <li>
          <a
            href="https://github.com/shuangliutjnu/TJNU-Ground-based-Cloud-Dataset"
            target="_blank"
            rel="noopener noreferrer"
          >
            TJNU ground-based cloud dataset (GCD)
          </a>
        </li>
        <li>
          <a
            href="https://www.kaggle.com/competitions/cloud-type-classification2/data"
            target="_blank"
            rel="noopener noreferrer"
          >
            Some Kaggle competition
          </a>
        </li>
        <li>CCSN dataset</li>
      </ul>

      <p>Species and supplementary features/varieties classifier:</p>
      <ul>
        <li>
          <a href="https://cloudatlas.wmo.int/en/search-image-gallery.html" target="_blank" rel="noopener noreferrer">
            WMO Cloud Atlas
          </a>
        </li>
        <li>
          <a href="https://cloudappreciationsociety.org/gallery/" target="_blank" rel="noopener noreferrer">
            Cloud Appreciation Society
          </a>
        </li>
      </ul>
    </section>
  );
}
