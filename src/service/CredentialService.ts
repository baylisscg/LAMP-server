import { Request, Response, Router } from "express"
import { Credential } from "../model/Credential"
import { SecurityContext, ActionContext, _verify } from "./Security"
const jsonata = require("../utils/jsonata") // FIXME: REPLACE THIS LATER WHEN THE PACKAGE IS FIXED
import { Repository } from "../repository/Bootstrap"

export const CredentialService = Router()
CredentialService.get(
  ["researcher", "study", "participant", "activity", "sensor", "type"].map((type) => `/${type}/:type_id/credential`),
  async (req: Request, res: Response) => {
    try {
      const repo = new Repository()
      const CredentialRepository = repo.getCredentialRepository()
      let type_id: string | null = req.params.type_id
      type_id = await _verify(req.get("Authorization"), ["self", "parent"], type_id === "null" ? null : type_id)
      let output = { data: await CredentialRepository._select(type_id) }
      output = typeof req.query.transform === "string" ? jsonata(req.query.transform).evaluate(output) : output
      res.json(output)
    } catch (e) {
      if (e.message === "401.missing-credentials") res.set("WWW-Authenticate", `Basic realm="LAMP" charset="UTF-8"`)
      res.status(parseInt(e.message.split(".")[0]) || 500).json({ error: e.message })
    }
  }
)
CredentialService.post(
  ["researcher", "study", "participant", "activity", "sensor", "type"].map((type) => `/${type}/:type_id/credential/`),
  async (req: Request, res: Response) => {
    try {
      const repo = new Repository()
      const CredentialRepository = repo.getCredentialRepository()
      let type_id: string | null = req.params.type_id
      const credential = req.body
      type_id = await _verify(req.get("Authorization"), ["self", "parent"], type_id === "null" ? null : type_id)
      const output = { data: await CredentialRepository._insert(type_id, credential) }
      res.json(output)
    } catch (e) {
      if (e.message === "401.missing-credentials") res.set("WWW-Authenticate", `Basic realm="LAMP" charset="UTF-8"`)
      res.status(parseInt(e.message.split(".")[0]) || 500).json({ error: e.message })
    }
  }
)
CredentialService.put(
  ["researcher", "study", "participant", "activity", "sensor", "type"].map(
    (type) => `/${type}/:type_id/credential/:access_key`
  ),
  async (req: Request, res: Response) => {
    try {
      const repo = new Repository()
      const CredentialRepository = repo.getCredentialRepository()
      let type_id: string | null = req.params.type_id
      const access_key = req.params.access_key
      const credential = req.body
      type_id = await _verify(req.get("Authorization"), ["self", "parent"], type_id === "null" ? null : type_id)
      const output = { data: await CredentialRepository._update(type_id, access_key, credential) }
      res.json(output)
    } catch (e) {
      if (e.message === "401.missing-credentials") res.set("WWW-Authenticate", `Basic realm="LAMP" charset="UTF-8"`)
      res.status(parseInt(e.message.split(".")[0]) || 500).json({ error: e.message })
    }
  }
)
CredentialService.delete(
  ["researcher", "study", "participant", "activity", "sensor", "type"].map(
    (type) => `/${type}/:type_id/credential/:access_key`
  ),
  async (req: Request, res: Response) => {
    try {
      const repo = new Repository()
      const CredentialRepository = repo.getCredentialRepository()
      let type_id: string | null = req.params.type_id
      const access_key = req.params.access_key
      type_id = await _verify(req.get("Authorization"), ["self", "parent"], type_id === "null" ? null : type_id)
      const output = { data: await CredentialRepository._delete(type_id, access_key) }
      res.json(output)
    } catch (e) {
      if (e.message === "401.missing-credentials") res.set("WWW-Authenticate", `Basic realm="LAMP" charset="UTF-8"`)
      res.status(parseInt(e.message.split(".")[0]) || 500).json({ error: e.message })
    }
  }
)
