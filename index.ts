import { DataType } from "@shopify/shopify-api";
import clientUtilities from "./src/Utilities/client-utilities.js";
import excelUtilities from "./src/Utilities/excel-utilities.js";

async function main() {
  const posts = excelUtilities.getJsonPosts();
  const BLOG_ID = "68299358366";

  for (const post of posts) {
    const article = {
      title: post[1],
      body_html: post[2],
      author: "ShareSpa",
      image: {
        src: post[3]?.split("|")[0] || ""
      },
      published_at: excelUtilities.formatDate(post[0])
    };
    try {
      await clientUtilities.restPost({ path: `blogs/${BLOG_ID}/articles`, type: DataType.JSON, data: { article } });
    } catch (err) {
      console.log(err, article);
    }
  }
}

main();
