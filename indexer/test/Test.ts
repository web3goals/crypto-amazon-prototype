import assert from "assert";
import { TestHelpers, Storefront_ProductListed } from "../generated";
const { MockDb, Storefront } = TestHelpers;

describe("Storefront contract ProductListed event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Storefront contract ProductListed event
  const event = Storefront.ProductListed.createMockEvent({
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  it("Storefront_ProductListed is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Storefront.ProductListed.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualStorefrontProductListed =
      mockDbUpdated.entities.Storefront_ProductListed.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedStorefrontProductListed: Storefront_ProductListed = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      asin: event.params.asin,
      seller: event.params.seller,
      price: event.params.price,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualStorefrontProductListed,
      expectedStorefrontProductListed,
      "Actual StorefrontProductListed should be the same as the expectedStorefrontProductListed"
    );
  });
});
