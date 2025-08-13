/**
 * Utility functions for handling and formatting errors
 */

export interface WalletError {
  message: string;
  code?: number | string;
  type?: "user_rejection" | "network_error" | "wallet_error" | "unknown";
}

/**
 * Extract a human-readable error message from various error types
 */
export function extractErrorMessage(error: any): WalletError {
  if (!error) {
    return { message: "Unknown error occurred", type: "unknown" };
  }

  // Handle string errors
  if (typeof error === "string") {
    return { message: error, type: "unknown" };
  }

  // Handle error objects
  if (typeof error === "object") {
    let message = "Unknown error occurred";
    let code = error.code || error.errorCode || error.status;
    let type: WalletError["type"] = "unknown";

    // MetaMask/Ethereum wallet specific error codes
    if (code) {
      switch (Number(code)) {
        case 4001:
          message = "User rejected the connection request";
          type = "user_rejection";
          break;
        case -32002:
          message =
            "Connection request already pending. Please check your wallet.";
          type = "wallet_error";
          break;
        case -32603:
          message = "Internal JSON-RPC error. Please try again.";
          type = "wallet_error";
          break;
        case -32000:
          message = "Wallet is locked or unavailable";
          type = "wallet_error";
          break;
        case 4100:
          message =
            "The requested account and/or method has not been authorized";
          type = "wallet_error";
          break;
        case 4200:
          message = "The requested method is not supported";
          type = "wallet_error";
          break;
        case 4900:
          message = "The provider is disconnected from all chains";
          type = "network_error";
          break;
        case 4901:
          message = "The provider is disconnected from the specified chain";
          type = "network_error";
          break;
        default:
          message =
            error.message ||
            error.reason ||
            error.data?.message ||
            `Wallet error (code: ${code})`;
          type = "wallet_error";
      }
    } else if (error.message) {
      message = String(error.message);

      // Detect error types based on message content
      if (
        message.includes("User rejected") ||
        message.includes("User denied")
      ) {
        type = "user_rejection";
      } else if (
        message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        message.includes("Network request failed")
      ) {
        type = "network_error";
      } else if (
        message.includes("not installed") ||
        message.includes("No Ethereum provider")
      ) {
        type = "wallet_error";
      }
    } else if (error.reason) {
      message = String(error.reason);
      type = "wallet_error";
    } else if (error.data && error.data.message) {
      message = String(error.data.message);
      type = "wallet_error";
    } else if (error.error && error.error.message) {
      message = String(error.error.message);
      type = "wallet_error";
    } else {
      // Try to extract any meaningful text from the error object
      const errorString = JSON.stringify(error);
      if (errorString && errorString !== "{}") {
        message = `Error object: ${errorString.substring(0, 200)}${errorString.length > 200 ? "..." : ""}`;
      }
      type = "wallet_error";
    }

    return { message, code, type };
  }

  return { message: "Unknown error occurred", type: "unknown" };
}

/**
 * Get user-friendly error messages for different error types
 */
export function getUserFriendlyErrorMessage(error: WalletError): string {
  switch (error.type) {
    case "user_rejection":
      return "Connection cancelled. Please try again if you want to connect your wallet.";
    case "network_error":
      return "Network connection issue. Please check your internet connection and try again.";
    case "wallet_error":
      return error.message;
    default:
      return error.message || "An unexpected error occurred. Please try again.";
  }
}

/**
 * Log error with context for debugging
 */
export function logWalletError(
  context: string,
  error: any,
  additionalInfo?: Record<string, any>,
) {
  const walletError = extractErrorMessage(error);

  // Safely serialize the original error
  let serializedError: any = null;
  try {
    if (error instanceof Error) {
      serializedError = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error as any), // Include any additional properties
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

  console.error(`[${context}] Wallet Error:`, walletError.message);
  console.error(`[${context}] Error Details:`, {
    message: walletError.message,
    code: walletError.code,
    type: walletError.type,
    originalError: serializedError,
    ...additionalInfo,
  });

  return walletError;
}

/**
 * Check if error should be retried automatically
 */
export function shouldRetryError(error: WalletError): boolean {
  return error.type === "network_error" && !error.message.includes("User");
}

/**
 * Check if error should be shown to user or silently handled
 */
export function shouldShowErrorToUser(error: WalletError): boolean {
  // Don't show user rejection errors as they're intentional
  return error.type !== "user_rejection";
}
