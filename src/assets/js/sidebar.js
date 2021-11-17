const container = document.getElementById('sidebar-container');
const services = window.electron.getServices();
const updateServiceButtons = () => {
  const currentAppIndex = window.electron.getCurrentAppIndex();
  const serviceButtons = document.querySelectorAll('.service-btn');
  for (let buttonIndex = 0; buttonIndex < serviceButtons.length; buttonIndex++) {
    serviceButtons[buttonIndex].classList.remove('disabled', 'btn-primary');
    serviceButtons[buttonIndex].classList.add('btn-outline-primary');
    if (currentAppIndex === buttonIndex) {
      serviceButtons[buttonIndex].classList.remove('btn-outline-primary');
      serviceButtons[buttonIndex].classList.add('disabled', 'btn-primary');
    }
  }
};

for (let appIndex = 0; appIndex < services.length; appIndex++) {
  var buttonRow = document.createElement('div');
  buttonRow.classList.add('row', 'py-1');

  var buttonCol = document.createElement('div');
  buttonCol.classList.add('col');

  var buttonIcon = document.createElement('img');
  buttonIcon.src = services[appIndex].details.defaultIcon;
  buttonIcon.width = 48;
  buttonIcon.height = 48;

  var serviceButton = document.createElement('button');
  serviceButton.classList.add('btn', 'btn-outline-primary', 'form-control', 'service-btn');
  serviceButton.dataset.appIndex = appIndex;
  serviceButton.setAttribute('tooltip', services[appIndex].details.name);
  serviceButton.addEventListener('click', () => {
    window.electron.switchToApp(appIndex);
    updateServiceButtons();
  });
  updateServiceButtons();

  container.appendChild(buttonRow);
  buttonRow.appendChild(buttonCol);
  buttonCol.appendChild(serviceButton);
  serviceButton.appendChild(buttonIcon);
}
