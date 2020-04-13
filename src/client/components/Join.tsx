import React from 'react';
import { connect } from 'react-redux';
import { AudioConstraint, MediaDevice, setAudioConstraint, setVideoConstraint, VideoConstraint, getMediaStream, enumerateDevices, play } from '../actions/MediaActions';
import { MediaState } from '../reducers/media';
import { State } from '../store';
import { Alerts, Alert } from './Alerts';
import { info, warning, error } from '../actions/NotifyActions';
import { ME, LAYOUT_MODES } from '../constants';
import { setNickname } from '../actions/NicknameActions';
import { changeLayout } from '../actions/LayoutActions';

export type MediaProps = MediaState & {
  changeLayout: typeof changeLayout
  visible: boolean
  enumerateDevices: typeof enumerateDevices
  onSetVideoConstraint: typeof setVideoConstraint
  onSetAudioConstraint: typeof setAudioConstraint
  onNickname: typeof setNickname
  getMediaStream: typeof getMediaStream
  nickname?: string
  play: typeof play
  logInfo: typeof info
  logWarning: typeof warning
  logError: typeof error
}

function mapStateToProps(state: State) {
  const visible = state.layout.widgets.join;
  const nickname = state.nicknames[ME];
  return {
    ...state.media,
    nickname,
    visible,
  };
}

const mapDispatchToProps = {
  changeLayout,
  enumerateDevices,
  onSetVideoConstraint: setVideoConstraint,
  onSetAudioConstraint: setAudioConstraint,
  onNickname: setNickname,
  getMediaStream,
  play,
  logInfo: info,
  logWarning: warning,
  logError: error,
};

const c = connect(mapStateToProps, mapDispatchToProps);

export const MediaForm = React.memo(function MediaForm(props: MediaProps) {

  React.useMemo(async () => await props.enumerateDevices(), []);

  async function onSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return joinCall();
  }

  async function joinCall() {
    const { audio, video } = props;
    try {
      await props.getMediaStream({ audio, video });
      props.changeLayout(LAYOUT_MODES.DEFAULT);
    } catch (err) {
      props.logError('Error: {0}', err);
    }
  }

  function onVideoChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const constraint: VideoConstraint = JSON.parse(event.target.value);
    props.onSetVideoConstraint(constraint);
  }

  function onAudioChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const constraint: AudioConstraint = JSON.parse(event.target.value);
    props.onSetAudioConstraint(constraint);
  }

  function onNicknameChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log('change nickname', event.target.value);
    props.onNickname({
      nickname: event.target.value,
      userId: ME,
    });
  }

  const videoId = JSON.stringify(props.video);
  const audioId = JSON.stringify(props.audio);
  const nickname = props.nickname;

  return (
    <form className='media' onSubmit={onSave}>
      <select
        name='video-input'
        onChange={onVideoChange}
        value={videoId}
      >
        <Options
          devices={props.devices}
          default='{"facingMode":"user"}'
          type='videoinput'
        />
      </select>

      <select
        name='audio-input'
        onChange={onAudioChange}
        value={audioId}
      >
        <Options
          devices={props.devices}
          default='true'
          type='audioinput'
        />
      </select>

      <div>
        <label htmlFor='nickname'>
          Nickname :
        </label>
        <input
          name='nickname'
          onChange={onNicknameChange}
          value={nickname}
        />
      </div>

      <button type='submit'>
        Join Call
      </button>
    </form>
  );
});

export interface AutoplayProps {
  play: () => void
}

export const AutoplayMessage = React.memo(
  function Autoplay(props: AutoplayProps) {
    return (
      <React.Fragment>
        Your browser has blocked video autoplay on this page.
        To continue with your call, please press the play button:
        &nbsp;
        <button className='button' onClick={props.play}>
          Play
        </button>
      </React.Fragment>
    );
  },
);

export const Join = c(React.memo(function Media(props: MediaProps) {
  if (!props.visible) {
    return null;
  }

  return (
    <div className='media-container'>
      <h2>Welcome to the party!</h2>
      <Alerts>
        {props.autoplayError && (
          <Alert>
            <AutoplayMessage play={props.play} />
          </Alert>
        )}
      </Alerts>

      <MediaForm {...props} />
    </div>
  );
}));

interface OptionsProps {
  devices: MediaDevice[]
  type: 'audioinput' | 'videoinput'
  default: string
}

const labels = {
  audioinput: 'Audio',
  videoinput: 'Video',
};

function Options(props: OptionsProps) {
  const label = labels[props.type];
  return (
    <React.Fragment>
      <option value='false'>Disable {label}</option>
      <option value={props.default}>Default {label}</option>
      {
        props.devices
        .filter(device => device.type === props.type)
        .map(device =>
          <option
            key={device.id}
            value={JSON.stringify({deviceId: device.id})}
          >
            {device.name || device.type}
          </option>,
        )
      }
    </React.Fragment>
  );
}
