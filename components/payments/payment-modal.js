import { useRef } from "react"
import { Input } from "../form-elements"
import Modal from "../modal"

export default function AddPaymentModal({ showModal, setShowModal, addNewPayment }) {
  const merchantNameInput = useRef()
  const acctNumInput = useRef()
  const expirationDate = useRef()
  const formRef = useRef()

  const handleSubmit = () => {
    if (!formRef.current.reportValidity()) return
    addNewPayment({
      account_number: acctNumInput.current.value,
      merchant_name: merchantNameInput.current.value,
      expiration_date: expirationDate.current.value
    })
  }

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} title="Add New Payment Method">
      <form ref={formRef}>
        <Input
          id="merchantName"
          type="text"
          label="Merchant Name"
          refEl={merchantNameInput}
          required={true}
        />
        <Input
          id="accNum"
          type="text"
          label="Account Number"
          refEl={acctNumInput}
          required={true}
        />
        <Input
          id="expirationDate"
          type="date"
          label="Expiration Date"
          refEl={expirationDate}
          required={true}
        />
      </form>
      <>
        <button
          className="button is-success"
          onClick={handleSubmit}
        >Add Payment Method</button>
        <button className="button" onClick={() => setShowModal(false)}>Cancel</button>
      </>
    </Modal>
  )
}
