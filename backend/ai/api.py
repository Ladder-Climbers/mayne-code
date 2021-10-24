import random

from secrets import SECRET_TENCENT_SECRET_ID, SECRET_TENCENT_SECRET_KEY
from utils.api_tools import *
import json
from tencentcloud.common import credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.tbp.v20190627 import tbp_client
from tencentcloud.tbp.v20190627 import models as tbp_models
from tencentcloud.tts.v20190823 import tts_client
from tencentcloud.tts.v20190823 import models as tts_models
import json


class AiAPI(Resource):
    def __init__(self, endpoint: str):
        super(AiAPI, self).__init__()
        self.cred = credential.Credential(SECRET_TENCENT_SECRET_ID, SECRET_TENCENT_SECRET_KEY)
        self.httpProfile = HttpProfile()
        self.httpProfile.endpoint = endpoint

        self.clientProfile = ClientProfile()
        self.clientProfile.httpProfile = self.httpProfile

    @staticmethod
    def generate_id() -> str:
        return str(random.randint(1, 2000))


class AiTtsAPI(AiAPI):
    args_get = reqparse.RequestParser() \
        .add_argument("text", type=str, help="文字", required=True, location=["args", ]) \
        .add_argument("voice_type", type=int, help="音色", required=False, location=["args", ])

    def __init__(self):
        super(AiTtsAPI, self).__init__("tts.tencentcloudapi.com")
        self.client = tts_client.TtsClient(self.cred, "ap-guangzhou", self.clientProfile)

    @args_required_method(args_get)
    def get(self):
        args = self.args_get.parse_args()
        text, voice_type = args.get('text'), args.get("voice_type")
        if voice_type is None:
            voice_type = 101006
        try:
            req = tts_models.TextToVoiceRequest()
            session_id = self.generate_id()
            params = {
                "Text": text,
                "SessionId": session_id,
                "ModelType": 1,
                "VoiceType": voice_type
            }
            req.from_json_string(json.dumps(params))

            resp = self.client.TextToVoice(req)
            logger.debug(f"{resp.to_json_string()}")
            resp_js = json.loads(resp.to_json_string())
            return make_result(data={
                'tts': resp_js
            })

        except Exception as err:
            logger.error(f'{err.__class__.__name__}: {err}')
            return make_result(500)


class AiTbpAPI(AiAPI):
    args_send_text = reqparse.RequestParser() \
        .add_argument("text", type=str, help="文字", required=True, location=["json", ]) \
        .add_argument("terminal_id", type=str, help="terminal_id", required=True, location=["json", ])

    def __init__(self):
        super(AiTbpAPI, self).__init__("tbp.tencentcloudapi.com")
        self.client = tbp_client.TbpClient(self.cred, "", self.clientProfile)

    def get(self):
        try:
            req = tbp_models.TextResetRequest()
            terminal_id = AiTbpAPI.generate_id()
            params = {
                "BotId": Constants.AI_BOT_ID,
                "BotEnv": Constants.AI_BOT_ENV,
                "TerminalId": terminal_id
            }
            req.from_json_string(json.dumps(params))

            resp = self.client.TextReset(req)
            logger.debug(f"{resp.to_json_string()}")
            resp_js = json.loads(resp.to_json_string())
            return make_result(data={
                'tbp': resp_js,
                'terminal_id': terminal_id
            })

        except Exception as err:
            logger.error(f'{err.__class__.__name__}: {err}')
            return make_result(500)

    @args_required_method(args_send_text)
    def post(self):
        args = self.args_send_text.parse_args()
        text, terminal_id = args.get("text"), args.get("terminal_id")
        if len(terminal_id) == 0:
            terminal_id = AiTbpAPI.generate_id()
            logger.warning(f"Got empty terminal! regenerated to: {terminal_id}")
        try:
            req = tbp_models.TextProcessRequest()
            params = {
                "BotId": Constants.AI_BOT_ID,
                "BotEnv": Constants.AI_BOT_ENV,
                "TerminalId": terminal_id,
                "InputText": text
            }
            req.from_json_string(json.dumps(params))

            resp = self.client.TextProcess(req)
            logger.debug(f"{resp.to_json_string()}")
            resp_js = json.loads(resp.to_json_string())
            return make_result(data={
                'tbp': resp_js
            })

        except Exception as err:
            logger.error(f'{err.__class__.__name__}: {err}')
            return make_result(500)
