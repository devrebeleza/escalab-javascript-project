/* Constants */
const url =
  'https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email';

/* Elements */
const form = document.getElementById('formulario-contacto');
const nameContact = document.getElementsByName('name_contact')[0];
const email = document.getElementsByName('email_contact')[0];
const phone = document.getElementsByName('phone_contact')[0];
const topic = document.getElementById('topic_contact');
const commit = document.getElementsByName('commit_contact')[0];
const messagge = document.getElementById('messagge_contact');

/* Regular Expressions */
const mailReg =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; //RegEx email según w3.org -> http://w3.unpocodetodo.info/utiles/regex-ejemplos.php?type=email

const phoneReg = /^\+?\d{7,15}$/;

/* Functions */
/*** Errors  ***/
const showError = (element, messagge) => {
  const error = element.nextElementSibling;
  element.classList.add('error');
  error.innerHTML = messagge;
};

const removeError = (element) => {
  const error = element.nextElementSibling;
  element.classList.remove('error');
  error.innerHTML = '';
};

const cleanErrors = ([...elements]) => {
  elements.forEach((element) => {
    removeError(element);
  });
};

const showMessageSendMail = (message, state) => {
  messagge.innerHTML = message;
  state === 'error'
    ? messagge.classList.add('error')
    : messagge.classList.add('success');
  setTimeout(() => {
    messagge.innerHTML = '';
    messagge.className = '';
  }, 3000);
};

/*** Call API ***/
sendEmail = async (name, email, phone, select, comment) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, phone, select, comment }),
  });

  const content = await response.json();
  return content;
};

/***  validate ***/
/*  
  Campo nombre y apellido no debe estar vacío y contener al menos un espacio.
  Campo correo debe tener un correo válido.
  Campo número de teléfono debe tener entre 7 y 15 dígitos, pudiendo tener un + al inicio, ignorando espacios en blanco.
  Campo comentario debe tener al menos 20 caracteres.
  En caso de pasar las validaciones, enviar petición a la API entregada en clase (https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email) usando fetch
*/
const validateForm = async (event) => {
  event.preventDefault();
  cleanErrors([nameContact, email, phone, commit]);
  let hasErrors = false;

  const sanitizedName = nameContact.value.trim();
  if (sanitizedName.length === 0 || sanitizedName.indexOf(' ') < 0) {
    showError(
      nameContact,
      'Nombre y apellido no debe estar vacío y debe contener al menos un espacio.'
    );
    hasErrors = true;
  }

  const sanitizedEmail = email.value.trim();
  if (!mailReg.exec(sanitizedEmail)) {
    showError(email, 'Email debe tener un correo válido.');
    hasErrors = true;
  }

  const sanitizedPhone = phone.value.replace(' ', '');
  if (!phoneReg.exec(sanitizedPhone)) {
    showError(
      phone,
      'El número de teléfono debe tener entre 7 y 15 dígitos, pudiendo tener un + al inicio.'
    );
    hasErrors = true;
  }

  const sanitizedCommit = commit.value.trim();
  if (sanitizedCommit.length < 20) {
    showError(commit, 'El comentario debe tener al menos 20 caracteres.');
    hasErrors = true;
  }

  if (!hasErrors) {
    let response = await sendEmail(
      sanitizedName,
      sanitizedEmail,
      sanitizedPhone,
      topic.value,
      sanitizedCommit
    );
    if (Object.keys(response.errors).length === 0) {
      showMessageSendMail(response.message, 'success');
      form.reset();
    } else {
      showMessageSendMail(response.message, 'error');
    }
  }
};

form.addEventListener('submit', validateForm);
