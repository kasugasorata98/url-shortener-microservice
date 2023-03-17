import redirect_mappingModel from '../../database/model/redirect_mapping.model'

class RedirectService {
  getTargetURL(shortId: string) {
    return redirect_mappingModel.findOne({
      'urlMappings.shortId': shortId,
    })
  }
}

export default RedirectService
