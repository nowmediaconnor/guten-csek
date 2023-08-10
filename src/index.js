/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

const { registerBlockType } = wp.blocks;

registerBlockType("guten-csek/video-block", {
    title: "Video Block",
    icon: "format-video",
    category: "design",
    edit: (props) => {
        return (
            <div className={props.className}>
                <video src={props.attributes.videoURL} controls></video>
            </div>
        );
    },
    save: (props) => {
        return <div>{props.attributes.videoURL}</div>;
    },
});
