const profilePickerList = document.getElementById('profile-picker-list');
const profilePickerMessage = document.getElementById('profile-picker-message');
const avatarColors = ['blue-avatar', 'green-avatar', 'purple-avatar', 'red-avatar'];

function createProfileChoice(profile, index) {
    const button = document.createElement('button');
    button.className = 'profile-choice';
    button.type = 'button';

    const avatar = document.createElement('span');
    avatar.className = `profile-avatar ${avatarColors[index % avatarColors.length]}`;
    avatar.textContent = profile.name.charAt(0).toUpperCase();

    const name = document.createElement('span');
    name.className = 'profile-choice-name';
    name.textContent = profile.name;

    button.append(avatar, name);
    button.addEventListener('click', () => {
        localStorage.setItem('selectedProfileId', profile._id);
        window.location.href = '/feed';
    });

    return button;
}

async function loadProfileChoices() {
    try {
        const response = await fetch('/api/profiles');
        const profiles = await response.json();

        if (!response.ok) {
            throw new Error('לא ניתן לטעון את הפרופילים.');
        }

        profilePickerMessage.textContent = '';
        profiles.forEach((profile, index) => {
            profilePickerList.appendChild(createProfileChoice(profile, index));
        });

        const addProfile = document.createElement('a');
        addProfile.className = 'add-profile-choice';
        addProfile.href = '/profiles';
        addProfile.innerHTML = '<span class="add-profile-icon">+</span><span>הוספת פרופיל</span>';
        profilePickerList.appendChild(addProfile);

        if (profiles.length === 0) {
            profilePickerMessage.textContent = 'עדיין אין פרופילים. צרו פרופיל כדי להתחיל לצפות.';
        }
    } catch (error) {
        profilePickerMessage.textContent = error.message;
    }
}

loadProfileChoices();
