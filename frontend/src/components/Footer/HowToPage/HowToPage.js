import collections from "../../../assets/images/how-to/profile-dropdown-collection.png";
import createNFT from "../../../assets/images/how-to/profile-dropdown-nft.png";
import metadata from "../../../assets/images/how-to/profile-dropdown-metadata.png";
import "./HowToPage.css";
import { Link } from "react-router-dom";

const copyIcon = (
  <svg
    className="guide__copy-icon"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="guide__copy-fill"
      d="M9.4515 15.9972H3.33878C2.04614 15.9972 0.996094 14.9467 0.996094 13.6539V5.00742C0.996094 3.71441 2.04634 2.66406 3.33878 2.66406H9.4515C10.7441 2.66406 11.7942 3.7146 11.7942 5.00742V13.6539C11.7942 14.9469 10.7439 15.9972 9.4515 15.9972ZM3.33878 4.01071C2.78667 4.01071 2.34251 4.45519 2.34251 5.00726V13.6537C2.34251 14.206 2.78686 14.6503 3.33878 14.6503H9.4515C10.0036 14.6503 10.4478 14.2058 10.4478 13.6537V5.00726C10.4478 4.455 10.0034 4.01071 9.4515 4.01071H3.33878Z"
      fill="white"
    />
    <path
      className="guide__copy-fill"
      d="M13.7458 12.4849C13.3688 12.4849 13.0726 12.1886 13.0726 11.8115V3.87882C13.0726 2.47823 11.9417 1.3468 10.5413 1.3468H5.15563C4.7786 1.3468 4.48242 1.05053 4.48242 0.6734C4.48242 0.296265 4.7786 0 5.15563 0H10.5413C12.682 0 14.4189 1.73729 14.4189 3.87878V11.8114C14.4189 12.175 14.1228 12.4848 13.7457 12.4848L13.7458 12.4849Z"
      fill="white"
    />
  </svg>
);

function HowToPage() {
  function copyText(evt) {
    const text = evt.target.closest("div").lastChild.textContent;
    navigator.clipboard.writeText(text);
  }

  return (
    <section className="guide">


      <div className="guide__contract">
        <p className="guide__instruction-title">
          Creating an NFT through your own/other than our smart contract
        </p>
        <p className="guide__instruction-text">
          For valid functionality your contract must <br />
          have these two methods
        </p>
        <p className="guide__instruction-text">It's necessary to implement nft_transfer_payout and nft_payout according to near non-fungible-toke standard:
          If you are using royalties then the implementation of these functions can be taken from the standard:<br />
          <a className="guide__instruction-text-link" target="_blank" rel="noreferrer" href="https://nomicon.io/Standards/NonFungibleToken/Payout.html">https://nomicon.io/Standards/NonFungibleToken/Payout.html</a>
        </p>
        <p className="guide__instruction-text">Another implementation can be found at near-examples:<br />
          <a className="guide__instruction-text-link" target="_blank" rel="noreferrer" href="https://github.com/near-examples/nft-tutorial/">https://github.com/near-examples/nft-tutorial/</a>
        </p>
        <div className="guide__contract-box">
          <div className="guide__method-box">
            <p className="guide__method-title">nft_approve</p>
            <div className="guide__code-box">
              <button
                className="guide__copy-button"
                type="button"
                onClick={(evt) => copyText(evt)}
              >
                {copyIcon}
              </button>
              <p className="guide__method-text">
                {"{"}
                <br />
                &nbsp;&nbsp;"token_id": "1",
                <br />
                &nbsp;&nbsp;"account_id": "lol.testnet",
                <br />
                &nbsp;&nbsp;"msg": "{"{"}
                \"price\":<wbr />\"100000000000000000000<wbr />00000\",\"market_type\":<wbr />\"sale\",\"ft_token_id\":<wbr />\"near\"
                {"}"}"<br />
                {"}"}
                <br />
                token_id{" "}
                <span className="guide__comments">
                  {"//"}token ID in you contract&nbsp;
                </span>
                <br />
                account_id{" "}
                <span className="guide__comments">
                  {"//"}contract ID added to the "approved contract IDs" array
                  of your contract
                </span>
              </p>
            </div>
          </div>

          <div className="guide__method-box">
            <p className="guide__method-title">nft_transfer</p>
            <div className="guide__code-box">
              <button
                className="guide__copy-button"
                type="button"
                onClick={(evt) => copyText(evt)}
              >
                {copyIcon}
              </button>
              <p className="guide__method-text">
                {"{"}
                <br />
                &nbsp;&nbsp;"receiver_id": "lol.testnet",
                <br />
                &nbsp;&nbsp;"token_id": "1"
                <br />
                {"}"}
                <br />
                receiver_id{" "}
                <span className="guide__comments">
                  {"//"}near token recipient ID&nbsp;
                </span>
                <br />
                token_id{" "}
                <span className="guide__comments">
                  {"//"}token ID in your contract
                </span>
              </p>
            </div>
          </div>
          <div className="guide__method-box">
            <p className="guide__method-subtitle">{'If your NFT contract has no royalties, you should still insert the nft_transfer_payout transfer implementation in your contract. Instead of returning the list of royalties it must return HashMap of {“<owner_id>”: balance}, ex:'}</p>
            <div className="guide__code-box">
              <button
                className="guide__copy-button"
                type="button"
                onClick={(evt) => copyText(evt)}
              >
                {copyIcon}
              </button>
              <p className="guide__method-text">
                {`#[payable]
    pub fn nft_transfer_payout(
        &mut self,
        receiver_id: ValidAccountId,
        token_id: String,
        approval_id: u64,
        balance: U128,
        max_len_payout: u32,
    ) -> HashMap<AccountId, U128> {
        assert_one_yocto();

        let owner_id = 
        self.
        tokens.
        owner_by_id.
        get(&token_id).
        expect("Token id does not exist");

        self
        .tokens
        .nft_transfer(receiver_id.clone(), token_id.clone(), Some(approval_id), None);

        env::log(
            json!({
                "type": "nft_transfer",
                "params": {
                    "token_id": token_id,
                    "sender_id": owner_id,
                    "receiver_id": receiver_id,
                }
            })
            .to_string()
            .as_bytes(),
        );

        let mut result: Payout = Payout { payout: HashMap::new() };
        result.payout.insert(owner_id, balance);
        Result
`}
              </p>
            </div>
          </div>

          <div className="guide__method-box">
            <p className="guide__method-subtitle">
              Each token needs its own JSON reference file, buried with the NFT
              file on the IPFS
            </p>
            <p className="guide__method-title">JSON Metadata reference</p>
            <div className="guide__code-box">
              <button
                className="guide__copy-button"
                type="button"
                onClick={(evt) => copyText(evt)}
              >
                {copyIcon}
              </button>
              <p className="guide__method-text">
                {"{"}
                <br />
                &nbsp;&nbsp;"name": "here goes the name"{" "}
                <span className="guide__comments">
                  {"//"}the name of your token,
                </span>
                <br />
                &nbsp;&nbsp;"description": "here goes the description"{" "}
                <span className="guide__comments">
                  {"//"}description of your token,
                </span>
                <br />
                &nbsp;&nbsp;"attributes": [
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{"{"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"trait_type": "here goes
                trait type name",
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value": "trait value"
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{"}"},<br />
                &nbsp;&nbsp;&nbsp;&nbsp;{"{"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"trait_type": "here goes the
                2nd trait name",
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value": "2nd trait value"
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                <br />
                &nbsp;&nbsp;],
                <br />
                &nbsp;&nbsp;"collection": {"{"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;"collection_id": "6223f517980a<wbr />0e01b214e930"{" "}
                <span className="guide__comments">{"//"}Not necessary,</span>
                <br />
                <span className="guide__comments">
                  {"//"}only if you want the token to be automatically added to
                  a collection you have created, you need to specify the
                  collection ID (this can be found in the header of your
                  collection page collection ID: 6220cace7f68421124ab3623)
                </span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;"name": "Test name"{" "}
                <span className="guide__comments">{"//"}collection name</span>
                <br />
                &nbsp;&nbsp;{"}"},<br />
                &nbsp;&nbsp;"properties": {"{"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;"files": [
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"{"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uri": "5759bf09066e-<wbr />APE.png",
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "image/png"
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;],
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;"category": "art",
                <br />
                <span className="guide__comments">
                  {"//"}For the filters to work correctly on our website, you
                  need to specify one of these values corresponding to your NFT
                  category ['art', 'collectables', 'metaverses', 'games' ].
                </span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;"rank": "12",
                <br />
                <span className="guide__comments">{"//"}rank format str, use if you set the rank yourself</span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;"creators": [
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"{"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address": "bratishka_alex.tes<wbr />tnet",
                <br />
                <span className="guide__comments">{"//"}near creator id</span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"share": 5000
                <br />
                <span className="guide__comments">
                  {"//"}royalty - format int (50% * 100) = 5000 || 100% max = 10000
                </span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;],
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;"explicitContent": false
                <br />
                <span className="guide__comments">
                  {"//"}true if your NFT contains Explicit &amp; Sensitive Content
                </span>
                <br />
                &nbsp;&nbsp;{"}"}
                <br />
                {"}"}
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="guide__title">
        How to create and add items to collection
      </h2>
      <p className="guide__subtitle">
        Key steps in building a completed nft collection
      </p>

      <div className="guide__collection-block">
        <div className="guide__instructions-box">
          <div className="guide__collection-title-box">
            <p className="guide__instruction-title">Creating a collection</p>
            <p className="guide__instruction-text">
              Open the{" "}
              <Link
                className="guide__instruction-link"
                to="/create-collection"

              >
                higgsfield.io/create-collection
              </Link>{" "}
              page via a direct link or via a profile popup
            </p>
          </div>
          <img
            className="guide__instruction-image"
            src={collections}
            alt="Profile dropdown menu"
          />
          <p className="guide__instruction-text">
            Fill in the data. All fields are required
            <br />
            (cover, avatar, name, description)
          </p>
          <div className="guide__choose-box">
            <div className="guide__choose-collection-image">
              <svg
                width="19"
                height="10"
                viewBox="0 0 19 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.8866 0.495306L8.27827 3.86121L10.2677 6.43061C10.5595 6.80745 10.4799 7.34702 10.0909 7.62966C9.70183 7.91229 9.14479 7.84377 8.853 7.45836C7.9246 6.25931 6.81051 4.82902 6.112 3.9126C5.75832 3.45867 5.05096 3.45867 4.69729 3.9126L1.16051 8.47756C0.72725 9.05139 1.14282 9.85647 1.86786 9.85647H17.7834C18.5084 9.85647 18.924 9.05139 18.4907 8.48612L12.3014 0.495306C11.9477 0.0328147 11.2403 0.0328147 10.8866 0.495306Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="guide__choose-button">
              <p className="guide__button-text">Choose File</p>
            </div>
          </div>
        </div>
        <p className="guide__box-text">
          Congrats! Collection is created but but as long as it is empty (does
          not contain NFTs) it is only visible to its creator, it is not
          available to other users (only through a direct link to it, on all
          pages with collection cards it is disabled)
        </p>
      </div>

      <div className="guide__interface">
        <div className="guide__instructions-box">
          <div className="guide__interface-title-box">
            <p className="guide__instruction-title">
              Creating NFTs through our interface
            </p>
            <p className="guide__instruction-text">
              Open the{" "}
              <Link
                className="guide__instruction-link"
                to="/create-item"

              >
                higgsfield.io/create-item
              </Link>{" "}
              page
              <br />
              via a direct link or via a profile popup
            </p>
          </div>
          <img
            className="guide__instruction-image"
            src={createNFT}
            alt="Profile dropdown menu"
          />
          <p className="guide__instruction-text">
            Fill out all the nessesary fields
            <br />
            (file, name, description).
            <br />
            With automatic listing, the price also
            <br />
            becomes necessary
          </p>
          <div className="guide__upload-box">
            <p className="guide__upload-title">Upload file</p>
            <p className="guide__upload-text">
              File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
              OGG. Max size: 100 MB
            </p>
            <div className="guide__upload-file-image">
              <svg
                width="28"
                height="16"
                viewBox="0 0 28 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16.0123 1.10714L12.0342 6.24054L15.0683 10.1592C15.5133 10.7339 15.392 11.5568 14.7986 11.9879C14.2053 12.4189 13.3557 12.3144 12.9107 11.7266C11.4948 9.89792 9.79569 7.71656 8.73038 6.31891C8.19098 5.62662 7.11218 5.62662 6.57278 6.31891L1.17878 13.281C0.518011 14.1562 1.15181 15.384 2.25758 15.384H26.5306C27.6363 15.384 28.2701 14.1562 27.6094 13.2941L18.1699 1.10714C17.6305 0.401787 16.5517 0.401787 16.0123 1.10714Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <p className="guide__instruction-text">
            Click “Create item” and sign the transaction
          </p>
          <div className="guide__create-button-box">
            <div className="guide__create-button">
              <p className="guide__create-text">Create item</p>
            </div>
            <svg
              className="guide__hand-icon"
              width="25"
              height="31"
              viewBox="0 0 25 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.52786 0.920566C7.1774 1.01285 6.96836 1.37169 7.06058 1.72192L8.06287 5.5281C8.15516 5.87857 8.51399 6.08761 8.86423 5.99539C9.21469 5.9031 9.42373 5.54426 9.33151 5.19403L8.32922 1.38785C8.23693 1.03738 7.8781 0.828338 7.52786 0.920566ZM15.9487 3.11253C15.8341 3.13938 15.723 3.20175 15.6153 3.29567L12.8158 6.06806C12.5586 6.32317 12.5599 6.7331 12.8151 6.99053C13.0702 7.24773 13.4801 7.24648 13.7375 6.99131L16.537 4.21892C16.7944 3.96374 16.7929 3.55388 16.5377 3.29644C16.338 3.12024 16.1395 3.06724 15.9487 3.11253ZM1.25187 6.99307C1.06098 7.0651 0.92989 7.22407 0.857105 7.42565C0.761749 7.77514 0.962627 8.13274 1.31211 8.22811L5.1139 9.26218C5.46339 9.35754 5.82099 9.15666 5.91636 8.80718C6.01173 8.4577 5.81084 8.1001 5.46136 8.00473L1.65956 6.97065C1.50395 6.93497 1.36637 6.9499 1.25187 6.99307ZM9.19837 7.2643C8.14435 7.54185 7.51862 8.61418 7.79632 9.66871L10.6362 20.4531L8.69933 18.2496C7.15198 16.5946 6.18263 17.0643 5.51068 17.7327C4.75393 18.5866 4.57833 19.3088 5.62806 20.7543C7.99914 23.9111 11.3196 27.5412 14.411 29.6344L22.975 27.3792C25.3975 24.3567 25.0269 13.1148 20.7356 13.7233C20.3539 13.8238 19.7587 14.0461 19.5505 14.3747C19.2164 13.106 18.0236 13.0723 17.5469 13.2064C17 13.3603 16.6789 13.7742 16.5289 14.4921C16.1948 13.2234 15.0764 13.1786 14.5253 13.3238C13.9186 13.4835 13.3147 14.0474 13.19 14.693L11.603 8.66645C11.3254 7.6122 10.2527 6.98666 9.19837 7.2643Z"
                fill="white"
                stroke="black"
              />
            </svg>
          </div>
        </div>
        <p className="guide__box-text guide__box-text_type_interface">
          Congrats! NFT is created! When you select a collection, it will
          automatically go into the selected collection If you specify other
          fields, they will be displayed on the NFT page
        </p>
      </div>

      <div className="guide__problems">
        <div className="guide__metadata-box">
          <p className="guide__metadata-text">
            If your tokens are displayed on NearWallet but not on HiggsField
            then try refresh metadata via profile popup, if this does not help
            there may be a problem in your Smart Contract, if you are sure
            everything is ok then here is the address of the support team
          </p>
          <img
            className="guide__instruction-image"
            src={metadata}
            alt="Profile dropdown menu"
          />
        </div>

        <div className="guide__messages-box">
          <p className="guide__instruction-title">
            Possible reasons for the following messages on your NFT page
          </p>
          <div className="guide__messages">
            <ul className="guide__messages-list">
              <li className="guide__message-item">
                Your smart contract does not support methods (nft_approve,
                nft_transfer)
              </li>
              <li className="guide__message-item">
                Your NFT has been blocked for site violations
              </li>
            </ul>
            <div className="guide__examples">
              <div className="guide__message-example">
                <p className="guide__message">item cannot be listed</p>
              </div>
              <div className="guide__message-example">
                <p className="guide__message">item cannot be transferred</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowToPage;
