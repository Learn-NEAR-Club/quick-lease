#!/usr/bin/env bash
set -e

echo
echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER
echo

# near call cron.in.testnet create_task '{"contract_id": "anytime-auction.cryptovaibhav.testnet","function_id": "start_auction","cadence": "*/2 * * * * *","recurring": true,"gas": 300000000000000}' --accountId cryptovaibhav.testnet --amount 10
# near call cron.in.testnet update_task '{"task_hash": "cKPBR0yuT8XAqrsWcPSrZkd9IlgqtBrnisfhl5LEJ70=", "cadence": "*/5 * * * * *","recurring": true,"gas": 300000000000000}' --accountId cryptovaibhav.testnet

# near view $CONTRACT get_all_items '{"state": 3}'
# cKPBR0yuT8XAqrsWcPSrZkd9IlgqtBrnisfhl5LEJ70=
# cKPBR0yuT8XAqrsWcPSrZkd9IlgqtBrnisfhl5LEJ70=
# near view cron.in.testnet get_task '{"task_hash": "cKPBR0yuT8XAqrsWcPSrZkd9IlgqtBrnisfhl5LEJ70="}'

# near call $CONTRACT start_auction --account_id $OWNER --gas 300000000000000

near view $CONTRACT get_all_items