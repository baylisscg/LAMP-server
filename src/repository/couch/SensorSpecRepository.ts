import { Database } from "../Bootstrap"
import { SensorSpec } from "../../model/SensorSpec"
import { SensorSpecInterface } from "../interface/RepositoryInterface"

export class SensorSpecRepository implements SensorSpecInterface {
  public async _select(id?: string, ignore_binary?: boolean): Promise<SensorSpec[]> {
    const data = await Database.use("sensor_spec").list({ include_docs: true, start_key: id, end_key: id })
    return (data.rows as any).map((x: any) => {       
      if(!!ignore_binary) {        
          delete x.settings_schema
      }
      return({
        id: x.doc._id,
        ...x.doc,
        _id: undefined,
        _rev: undefined,
      })
    })
  }
  public async _insert(object: SensorSpec): Promise<{}> {
    try {
      const res: any = await Database.use("sensor_spec").find({
        selector: { _id: object.name, _deleted: false },
        limit: 1,
      })
      if(res.length > 0) {
        throw new Error("500.sensorspec-already-exist")
      } else {
          const orig: any = await Database.use("sensor_spec").find({
            selector: { _id: object.name, _deleted: true },
            limit: 1,
          })
          if(orig.length > 0) {
            await Database.use("sensor_spec").bulk({
              docs: [
                {
                  ...orig,
                  _deleted: false
                }
              ]})
          } else {
          await Database.use("sensor_spec").insert({
            _id: object.name,
            settings_schema: object.settings_schema ?? {}
          } as any)
        }
      }
      return {}
    } catch (error) {
      throw new Error("500.sensorspec-creation-failed")
    }
  }
  public async _update(id: string, object: SensorSpec): Promise<{}> {
    const orig: any = await Database.use("sensor_spec").get(id)
    await Database.use("sensor_spec").bulk({
      docs: [
        {
          ...orig,
          settings_schema: object.settings_schema ?? orig.settings_schema
        },
      ],
    })
    return {}
  }
  public async _delete(id: string): Promise<{}> {
    const orig: any = await Database.use("sensor_spec").get(id)
    await Database.use("sensor_spec").bulk({ docs: [{ ...orig, _deleted: true }] })
    return {}
  }
}
