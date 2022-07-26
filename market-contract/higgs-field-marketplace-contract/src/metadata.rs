use crate::*;

//The Json token is what will be returned from view calls. 
#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ReferralChildData {
    //Account ID
    pub father_referral: AccountId
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ReferralFatherData {
    //Account ID
    pub child_referral: AccountId
}