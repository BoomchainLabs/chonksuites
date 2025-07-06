#!/bin/bash

# Chonk9k Suite CLI Helper Script
# Makes it easier to run Web3 operations

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case $1 in
  "balance")
    tsx "$SCRIPT_DIR/cli-utils.ts" balance "$2" "$3"
    ;;
  "validate")
    tsx "$SCRIPT_DIR/cli-utils.ts" validate "$2" "$3"
    ;;
  "status")
    tsx "$SCRIPT_DIR/cli-utils.ts" status
    ;;
  "token")
    shift
    tsx "$SCRIPT_DIR/token-manager.ts" "$@"
    ;;
  "help"|*)
    echo "Chonk9k Suite CLI"
    echo ""
    echo "Usage: ./scripts/cli.sh <command> [args...]"
    echo ""
    echo "Commands:"
    echo "  balance <wallet-address> <network>  - Check wallet balances"
    echo "  validate <address> <network>        - Validate wallet address"
    echo "  status                              - Check network status"
    echo "  token <command> [args...]           - Token management operations"
    echo "  help                                - Show this help"
    echo ""
    echo "Token Commands:"
    echo "  token check <SLERF|CHONKPUMP>      - Check token info"
    echo "  token balance <wallet> <network>    - Check token balances"
    echo "  token report                        - Generate distribution report"
    echo "  token validate                      - Validate token addresses"
    echo ""
    echo "Examples:"
    echo "  ./scripts/cli.sh balance 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM solana"
    echo "  ./scripts/cli.sh token check SLERF"
    echo "  ./scripts/cli.sh status"
    ;;
esac