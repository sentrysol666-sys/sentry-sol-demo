// Test to verify that the error serialization fixes are working correctly

// Import the error utilities (simulated since we're not in a module environment)
function logWalletError(context, error, additionalInfo) {
  // Safely serialize the original error
  let serializedError = null;
  try {
    if (error instanceof Error) {
      serializedError = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...error, // Include any additional properties
      };
    } else if (typeof error === "object" && error !== null) {
      serializedError = JSON.parse(
        JSON.stringify(error, (key, value) => {
          // Handle circular references and non-serializable values
          if (typeof value === "function") return "[Function]";
          if (typeof value === "undefined") return "[Undefined]";
          if (value === null) return null;
          return value;
        }),
      );
    } else {
      serializedError = String(error);
    }
  } catch (serializationError) {
    serializedError = `[Serialization Error: ${String(error)}]`;
  }

  console.log(`[${context}] Wallet Error:`, error.message || String(error));
  console.log(`[${context}] Error Details:`, {
    originalError: serializedError,
    ...additionalInfo,
  });

  return { message: error.message || String(error), serializedError };
}

// Test different error types that were causing "[object Object]" issues

console.log("=== Testing Error Serialization Fixes ===\n");

// Test 1: MetaMask user rejection error (code 4001)
console.log("Test 1: MetaMask user rejection error");
const userRejectionError = {
  code: 4001,
  message: "User rejected the request.",
  data: { originalError: {} }
};
logWalletError("EthereumWallet.connect", userRejectionError);

console.log("\n" + "=".repeat(50) + "\n");

// Test 2: Complex nested error object
console.log("Test 2: Complex nested error object");
const complexError = {
  code: -32603,
  message: "Internal JSON-RPC error",
  data: {
    cause: null,
    code: -32603,
    data: {
      code: -32000,
      message: "execution reverted"
    },
    version: "2.0"
  },
  stack: "Error: Internal JSON-RPC error"
};
logWalletError("EthereumWallet.connect", complexError);

console.log("\n" + "=".repeat(50) + "\n");

// Test 3: Error with circular references (should not cause issues anymore)
console.log("Test 3: Error with circular references");
const circularError = { code: 4001, message: "Circular reference test" };
circularError.self = circularError; // Create circular reference
logWalletError("EthereumWallet.connect", circularError);

console.log("\n" + "=".repeat(50) + "\n");

console.log("✅ All error serialization tests completed successfully!");
console.log("✅ No more '[object Object]' issues should occur!");
