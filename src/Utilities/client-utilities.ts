import dotenv from "dotenv";
import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion, Session, Shopify } from "@shopify/shopify-api";
import { RestClient } from "@shopify/shopify-api/lib/clients/rest/rest_client";
import generalUtilities from "./general-utilities.js";
dotenv.config();

class Client {
  private shopify: Shopify;
  private session: Session;
  private restClient: RestClient;

  constructor() {
    this.shopify = this.initiateShopify();
    this.session = this.initiateSession();

    this.restClient = new this.shopify.clients.Rest({ session: this.session, apiVersion: ApiVersion.January23 });
  }

  private initiateShopify() {
    return shopifyApi({
      apiKey: process.env.API_KEY || "",
      apiSecretKey: process.env.SECRET_KEY || "",
      apiVersion: ApiVersion.January23,
      scopes: JSON.parse(process.env.SCOPES || "[]"),
      hostName: process.env.SHOPIFY_DOMAIN || "",
      isEmbeddedApp: true
    });
  }

  private initiateSession() {
    return new Session({
      accessToken: process.env.ADMIN_API_KEY,
      shop: process.env.SHOPIFY_DOMAIN || "",
      id: "sharespaappsession",
      isOnline: true,
      state: "initial"
    });
  }

  public async restGet({ path, type = undefined, data = undefined, query = undefined, extraHeaders = undefined, tries = undefined }) {
    return this.restRequest({ method: "get", path, type, data, query, extraHeaders, tries });
  }

  public async restDelete({ path, type = undefined, data = undefined, query = undefined, extraHeaders = undefined, tries = undefined }) {
    return this.restRequest({ method: "delete", path, type, data, query, extraHeaders, tries });
  }

  public async restPost({ path, type, data, query = undefined, extraHeaders = undefined, tries = undefined }) {
    return this.restRequest({ method: "post", path, type, data, query, extraHeaders, tries });
  }

  public async restPut({ path, type, data, query = undefined, extraHeaders = undefined, tries = undefined }) {
    return this.restRequest({ method: "put", path, type, data, query, extraHeaders, tries });
  }

  public async restRequest({ method, path, type = undefined, data = undefined, query = undefined, extraHeaders = undefined, tries = undefined }) {
    return this.performRequest(async () => {
      const response = await this.restClient[method]({
        path,
        type,
        data,
        query,
        extraHeaders,
        tries
      });

      return response.body;
    });
  }

  public async performRequest(action: any) {
    let tries = 10;

    while (tries--) {
      try {
        return await action();
      } catch (err) {
        const retryAfterHeader = err?.response?.status === 429 && err?.response?.headers["retry-after"];

        if (retryAfterHeader) {
          console.log(`Waiting ${retryAfterHeader} before making another request to shopify`);
          await generalUtilities.sleep(parseInt(retryAfterHeader) * 1000);
        } else {
          throw err;
        }
      }
    }
  }

  public getRestClient() {
    return this.restClient;
  }
}

export default new Client();
