import {App} from "~/server";
import {Logger} from "pino";
import {API_Error} from "~/types/errors";

export class WireguardModule {

    App: App
    logger: Logger

    constructor(mainClass: App) {
        this.App = mainClass
        this.logger = this.App.AppLogger.createChildLogger(this.constructor.name)
    }

    async getWireguardPeersOffline() {
        return [
            {
                "public_key": "GopBQ5vBdjC039w/WgwSUEJzsPVt+4w1SI6exea5t1Q=",
                "url_safe_public_key": "GopBQ5vBdjC039w_WgwSUEJzsPVt-4w1SI6exea5t1Q=",
                "preshared_key": "exystDFB/EQSjCbBaCMfzC31kN8NhZGCnQrlnOZC5pw=",
                "allowed_ips": [
                    "10.0.0.2/32"
                ],
                "last_handshake_time": "2025-02-23T20:57:40.015408975Z",
                "persistent_keepalive_interval": "15s",
                "endpoint": "176.140.219.1:4973",
                "receive_bytes": 57511216,
                "transmit_bytes": 915117180
            },
            {
                "public_key": "UGl8asvaJLYuq0++zfrR1+RCU97nNCqigR/3pQZa7no=",
                "url_safe_public_key": "UGl8asvaJLYuq0--zfrR1-RCU97nNCqigR_3pQZa7no=",
                "preshared_key": "bFRYIIcE9ijtudAQUE+Vs/sIfL4Ygs7t+QItGA9x4yU=",
                "allowed_ips": [
                    "10.0.0.4/32"
                ],
                "last_handshake_time": "0001-01-01T00:00:00Z",
                "persistent_keepalive_interval": "15s",
                "endpoint": "",
                "receive_bytes": 0,
                "transmit_bytes": 0
            },
            {
                "public_key": "baRHIcpscI/XKh/nusLWb+RoOnUbfAhz/7hJBPJfDhQ=",
                "url_safe_public_key": "baRHIcpscI_XKh_nusLWb-RoOnUbfAhz_7hJBPJfDhQ=",
                "preshared_key": "OxcHwrk3GmKBzlUaTAgfe+Cr4rL5I46v7FDbKKVtGqU=",
                "allowed_ips": [
                    "10.0.0.5/32"
                ],
                "last_handshake_time": "0001-01-01T00:00:00Z",
                "persistent_keepalive_interval": "15s",
                "endpoint": "",
                "receive_bytes": 0,
                "transmit_bytes": 0
            },
            {
                "public_key": "4fMY8+oPfvZVPGy2pUBZcnpfr++tCr03pMph4yLVoHE=",
                "url_safe_public_key": "4fMY8-oPfvZVPGy2pUBZcnpfr--tCr03pMph4yLVoHE=",
                "preshared_key": "yBS4uxbOz409qZrCBYH8f3oLPHKwJqhijlmpdEl99QY=",
                "allowed_ips": [
                    "10.0.0.6/32"
                ],
                "last_handshake_time": "0001-01-01T00:00:00Z",
                "persistent_keepalive_interval": "15s",
                "endpoint": "",
                "receive_bytes": 0,
                "transmit_bytes": 0
            },
            {
                "public_key": "4Ig6/aVmDTN0u1Imiq1XBjkc5LzS5jUxKMT/se77llc=",
                "url_safe_public_key": "4Ig6_aVmDTN0u1Imiq1XBjkc5LzS5jUxKMT_se77llc=",
                "preshared_key": "bA24MWXksVA1l3+tNaZynRt50n3UmE4ebduoX4QvFLo=",
                "allowed_ips": [
                    "10.0.0.7/32"
                ],
                "last_handshake_time": "0001-01-01T00:00:00Z",
                "persistent_keepalive_interval": "15s",
                "endpoint": "",
                "receive_bytes": 0,
                "transmit_bytes": 0
            },
            {
                "public_key": "XfFoPo8kgBjCXxSjrb/oe787Q9oyDuxIArxDnWeu/HQ=",
                "url_safe_public_key": "XfFoPo8kgBjCXxSjrb_oe787Q9oyDuxIArxDnWeu_HQ=",
                "preshared_key": "cfEoCkEpdrl0JpbeUrIKFtAE+c07YH5ZIcNpZOSKaDg=",
                "allowed_ips": [
                    "10.0.0.8/32"
                ],
                "last_handshake_time": "0001-01-01T00:00:00Z",
                "persistent_keepalive_interval": "15s",
                "endpoint": "",
                "receive_bytes": 0,
                "transmit_bytes": 0
            },
            {
                "public_key": "5RyP4nJ9jWXCd6bgWNFw2q3MeV9V29SFaHwjLJ9HGgc=",
                "url_safe_public_key": "5RyP4nJ9jWXCd6bgWNFw2q3MeV9V29SFaHwjLJ9HGgc=",
                "preshared_key": "cnvtYrT2KtozzbTnSRmg5wNrjCwrfM70lxqNiUC8JKc=",
                "allowed_ips": [
                    "10.0.0.9/32"
                ],
                "last_handshake_time": "0001-01-01T00:00:00Z",
                "persistent_keepalive_interval": "15s",
                "endpoint": "",
                "receive_bytes": 0,
                "transmit_bytes": 0
            },
            {
                "public_key": "sgKTPAzHWtOAQuT7PPXTxLM/FKUwMh9RALZmhzd8tEs=",
                "url_safe_public_key": "sgKTPAzHWtOAQuT7PPXTxLM_FKUwMh9RALZmhzd8tEs=",
                "preshared_key": "gItDKTfNglRVoYR9R30laGCERWh3ion/W4E7CRMPjEY=",
                "allowed_ips": [
                    "10.0.0.101/32"
                ],
                "last_handshake_time": "2025-02-23T20:57:46.239698951Z",
                "persistent_keepalive_interval": "15s",
                "endpoint": "90.11.131.167:46625",
                "receive_bytes": 862520,
                "transmit_bytes": 1301828
            },
            {
                "public_key": "ZtTRywBvc+rOKCdEcWRYiQjWs/e1aq5hPeHg3hot1UA=",
                "url_safe_public_key": "ZtTRywBvc-rOKCdEcWRYiQjWs_e1aq5hPeHg3hot1UA=",
                "preshared_key": "mv1xv+tC7bRXYJ96FmpfbJw7PLjLRsWuzzOKGSoxs6s=",
                "allowed_ips": [
                    "10.0.0.100/32"
                ],
                "last_handshake_time": "2025-02-23T20:58:16.256037317Z",
                "persistent_keepalive_interval": "15s",
                "endpoint": "90.11.131.167:56073",
                "receive_bytes": 3851600,
                "transmit_bytes": 3590452
            }
        ]
    }

    async getWireguardPeers() {
        try {
            let response = await fetch('http://serv-aws-01.ad.vilaloris.fr:8100/v1/devices/wg0/peers/');
            return await response.json();
        } catch (e) {
            throw new API_Error('API_INTERN_ERROR', 'Erreur lors de la récupération des informations peers de wireguard...', {cause: e})
        }
    }

}
