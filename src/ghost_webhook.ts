import express from 'express';
import SubscriptionService from './services/SubscriptionService.js';
import PublisherService from './services/PublisherService.js';

//some zod types


const router = express.Router();
//autheticate request
router.param('publisherUUID', (req,res,next,publisherUUID) => {
  console.log(publisherUUID);
  
  //Returns INVALID_OBJ
  //let ghostSignatureComponents = parseGhostSignature(req.headers["x-ghost-signature"])
  //throw error if fails
  const publisherService = PublisherService.getPublisherService();
  req.publisherUUID = publisherUUID;

  //throw invalid user error if fails INVALID_CRED error

  //perform cryptographic signature verficiation 
  //req.validSignature = performGhostCryptoValidation(publisherId,ghost-signature-header)
  //throw invalid signature error if fails INVALID_CRED error
  next();
})

router.post('/:publisherUUID/member', async (req,res,next) => {
  //goes from incoming request -> parsed ghost subscription -> persisted subscription

  const subscriptionService = SubscriptionService.getSubscriptionService();
  const parsedRequest = subscriptionService.parseGhostRequest(req.publisherUUID,req.body.member.current);
  res.status(200);
  res.json({message:"OK"});
  res.send();
  await subscriptionService.addNewSubscriber(parsedRequest);
  
});

export default router;
