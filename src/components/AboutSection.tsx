import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section class={styles.about}>
      <h2>About</h2>

      <p>
        A custom built cloud classifier trained with Keras that runs locally in-browser using Tensorflow JS. The
        application is built on 3 separate models, reflecting cloud nomenclature being formatted as such:{" "}
        {"<genus> [species] [list of supplementary features and varieties]"}, where names wrapped with {"<>"} are
        required and {"[]"} are optional. Genus and species have mutually exclusive names, whilst supplementary features
        and varieties are not, allowing appending as many names as applicable, apart from one exception (which I have
        not hardcoded to prevent yet).
      </p>

      <p>
        All 3 models share a common convolutional neural network that was trained on the genera dataset as it had the
        most data, with the other models being made by transfer-learning on the common CNN.
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
            HuaYun BJUT MIP Cloud Dataset
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
        <li>
          <a
            href="https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/CADDPD"
            target="_blank"
            rel="noopener noreferrer"
          >
            CCSN dataset
          </a>
        </li>
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

      <p>The current results of the training are organized in the table below.</p>

      <table>
        <tbody>
          <tr>
            <th>Model</th>
            <th>Training accuracy</th>
            <th>Validation accuracy</th>
          </tr>
          <tr>
            <td>Genera</td>
            <td>96.7%</td>
            <td>89.4%</td>
          </tr>
          <tr>
            <td>Species</td>
            <td>60%</td>
            <td>54%</td>
          </tr>
          <tr>
            <td>Supp.</td>
            <td>70%</td>
            <td>56.4%</td>
          </tr>
        </tbody>
      </table>

      <p>
        Evident from the results, the species and supplementary features/varieties models are much weaker than the
        genera model. This is likely due to bad training data, as the data was compiled from scraping websites. However,
        the supplementary model is likely architected non-ideally, as due to the nature of its nomenclature, image
        segmentation should be used instead.
      </p>

      <p>It is my goal to improve this project in the future, so stay tuned.</p>
    </section>
  );
}
